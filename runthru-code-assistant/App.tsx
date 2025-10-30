import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ActionType } from './types';
import { processCode } from './services/geminiService';
import { LogoIcon, LogoutIcon, SyncIcon, ExplainIcon, RefactorIcon, DebugIcon, UploadIcon, CodeBracketsIcon } from './components/icons';

import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { okaidia } from '@uiw/codemirror-theme-okaidia';

import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import remarkGfm from 'remark-gfm';

type ActionButtonProps = {
  icon: React.ReactNode;
  label: ActionType;
  isActive: boolean;
  onClick: () => void;
  isLoading: boolean;
};

// Custom style for syntax highlighting in the explanation panel
const customSyntaxStyle = {
  'code[class*="language-"]': {
    color: '#39ff14', // Main text color
    background: 'none',
    fontFamily: '"VT323", monospace',
    textAlign: 'left' as const,
    whiteSpace: 'pre' as const,
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none' as const,
    MozHyphens: 'none' as const,
    msHyphens: 'none' as const,
    hyphens: 'none' as const,
    textShadow: 'none',
  },
  'pre[class*="language-"]': {
    color: '#39ff14',
    background: '#050a05',
    fontFamily: '"VT323", monospace',
    textAlign: 'left' as const,
    whiteSpace: 'pre' as const,
    wordSpacing: 'normal',
    wordBreak: 'normal',
    wordWrap: 'normal',
    lineHeight: '1.5',
    MozTabSize: '4',
    OTabSize: '4',
    tabSize: '4',
    WebkitHyphens: 'none' as const,
    MozHyphens: 'none' as const,
    msHyphens: 'none' as const,
    hyphens: 'none' as const,
    padding: '1em',
    margin: '.5em 0',
    overflow: 'auto',
    borderRadius: '4px',
    border: '1px solid rgba(57, 255, 20, 0.2)',
    textShadow: 'none',
  },
  ':not(pre) > code[class*="language-"]': {
    background: '#050a05',
    padding: '.1em',
    borderRadius: '.3em',
    whiteSpace: 'normal',
  },
  'comment': { color: 'rgba(57, 255, 20, 0.6)' },
  'prolog': { color: 'rgba(57, 255, 20, 0.6)' },
  'doctype': { color: 'rgba(57, 255, 20, 0.6)' },
  'cdata': { color: 'rgba(57, 255, 20, 0.6)' },
  'punctuation': { color: 'rgba(57, 255, 20, 0.9)' },
  'property': { color: '#9eff8a' },
  'tag': { color: '#5eff4a' },
  'constant': { color: '#9eff8a' },
  'symbol': { color: '#9eff8a' },
  'deleted': { color: '#9eff8a' },
  'boolean': { color: '#5eff4a' },
  'number': { color: '#9eff8a' },
  'selector': { color: '#39ff14' },
  'attr-name': { color: '#5eff4a' },
  'string': { color: '#39ff14' },
  'char': { color: '#39ff14' },
  'builtin': { color: '#5eff4a' },
  'inserted': { color: '#5eff4a' },
  'operator': { color: 'rgba(57, 255, 20, 0.9)' },
  'entity': { color: 'rgba(57, 255, 20, 0.9)', cursor: 'help' },
  'url': { color: 'rgba(57, 255, 20, 0.9)' },
  'variable': { color: '#ADFF2F' }, 
  'atrule': { color: '#5eff4a' },
  'attr-value': { color: '#39ff14' },
  'function': { color: '#9eff8a' },
  'class-name': { color: '#ADFF2F' },
  'keyword': { color: '#5eff4a' },
  'regex': { color: '#39ff14' },
  'important': { color: '#5eff4a', fontWeight: 'bold' },
  'bold': { fontWeight: 'bold' },
  'italic': { fontStyle: 'italic' },
};

const ActionButton: React.FC<ActionButtonProps> = ({ icon, label, isActive, onClick, isLoading }) => (
  <button
    onClick={onClick}
    disabled={isLoading}
    className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 text-sm transition-all duration-300 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed ${
      isActive
        ? 'bg-matrix-green text-black border-matrix-green shadow-glow-green'
        : 'bg-transparent border-matrix-green/50 text-matrix-green hover:bg-matrix-green/10 hover:border-matrix-green'
    }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

type LandingStage = 
  'booting' | 'cleared' | 'logo' | 'prompt' | 
  'login-user' | 'login-pass' | 'authenticating' | 'auth-fail' |
  'register-user' | 'register-pass' | 'registering';


// --- Constants moved outside component to prevent re-creation on render ---
const bootSequence = [
  'Booting RunThru OS v2.5...',
  'Initializing kernel...',
  'Loading system modules... [OK]',
  'Mounting virtual file system... [OK]',
  'Connection established.',
];

const logo = [
  ' mmmmmm                                  mm                           ',
  ' ##""""##                        ##      ##                           ',
  ' ##    ##  ##    ##  ##m####m  #######   ##m####m   ##m####  ##    ##',
  ' #######   ##    ##  ##"   ##    ##      ##"   ##   ##"      ##    ##',
  ' ##  "##m  ##    ##  ##    ##    ##      ##    ##   ##       ##    ##',
  ' ##    ##  ##mmm###  ##    ##    ##mmm   ##    ##   ##       ##mmm###',
  ' ""    """  """" ""  ""    ""     """"   ""    ""   ""        """" ""',
];

const welcomeText = [
  '',
  'Welcome, operative. System ready.',
  'Type "login" or "register" to continue.',
];
// --- End of constants ---

// Custom hook for the typing animation using requestAnimationFrame for smoothness
const useTypingEffect = (lines: readonly string[], typingSpeed: number = 25, onComplete?: () => void) => {
    const [displayedText, setDisplayedText] = useState<string[]>(['']);
    const [isTyping, setIsTyping] = useState(true);
    const onCompleteRef = useRef(onComplete);

    useEffect(() => {
        onCompleteRef.current = onComplete;
    }, [onComplete]);

    useEffect(() => {
        setDisplayedText(['']);
        setIsTyping(true);

        let lineIndex = 0;
        let charIndex = 0;
        let lastTime = 0;
        let animationFrameId: number;

        const animate = (timestamp: number) => {
            if (lineIndex >= lines.length) {
                setIsTyping(false);
                if (onCompleteRef.current) onCompleteRef.current();
                return;
            }

            if (!lastTime) lastTime = timestamp;
            const deltaTime = timestamp - lastTime;

            if (deltaTime > typingSpeed) {
                lastTime = timestamp;
                const currentLine = lines[lineIndex];

                setDisplayedText(prev => {
                    const newText = [...prev];
                    newText[lineIndex] = currentLine.substring(0, charIndex + 1);
                    return newText;
                });
                
                charIndex++;

                if (charIndex > currentLine.length) {
                    lineIndex++;
                    charIndex = 0;
                    if (lineIndex < lines.length) {
                        setDisplayedText(prev => [...prev, '']);
                    }
                }
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [lines, typingSpeed]);

    return { displayedText, isTyping };
};


const LandingPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [stage, setStage] = useState<LandingStage>('booting');
  const [history, setHistory] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isPassword, setIsPassword] = useState(false);
  const [tempUser, setTempUser] = useState('');
  
  // Mock user database
  const userDB = useRef<Record<string, string>>({ user: 'password' });
  
  const inputRef = useRef<HTMLInputElement>(null);
  
  const onBootComplete = useCallback(() => {
    setTimeout(() => setStage('cleared'), 700);
  }, []);

  const { displayedText: bootText, isTyping: isBooting } = useTypingEffect(bootSequence, 30, onBootComplete);
  
  useEffect(() => {
    if (stage === 'cleared') {
        setTimeout(() => {
            setHistory([]);
            setStage('logo');
        }, 300);
    } else if (stage === 'logo') {
        setHistory([...logo, ...welcomeText]);
        setTimeout(() => setStage('prompt'), 500);
    } else if (stage === 'auth-fail') {
        setTimeout(() => {
            setHistory([...logo, ...welcomeText, 'Authentication failed. Please try again.']);
            setTempUser('');
            setInputValue('');
            setStage('prompt');
        }, 1500);
    }
  }, [stage]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [history, stage]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const command = inputValue.toLowerCase().trim();
    const promptText = getCurrentPrompt();
    setHistory(prev => [...prev, `${promptText} ${isPassword ? '********' : command}`]);
    const currentInputValue = inputValue; // Capture value before clearing
    setInputValue('');

    switch(stage) {
      case 'prompt':
        if (command === 'login') {
          setStage('login-user');
          setIsPassword(false);
        } else if (command === 'register') {
          setStage('register-user');
          setIsPassword(false);
        } else {
          setHistory(prev => [...prev, `command not found: ${command}`]);
        }
        break;
      case 'login-user':
        setTempUser(command);
        setStage('login-pass');
        setIsPassword(true);
        break;
      case 'login-pass':
        setStage('authenticating');
        setIsPassword(false);
        setHistory(prev => [...prev, 'Authenticating...']);
        setTimeout(() => {
            if (userDB.current[tempUser] && userDB.current[tempUser] === currentInputValue) {
                 setHistory(prev => [...prev, '... [ACCESS GRANTED]']);
                 setTimeout(onLogin, 1500);
            } else {
                 setHistory(prev => [...prev, '... [ACCESS DENIED]']);
                 setTimeout(() => setStage('auth-fail'), 1000);
            }
        }, 2000);
        break;
      case 'register-user':
        setTempUser(command);
        setStage('register-pass');
        setIsPassword(true);
        break;
      case 'register-pass':
        setStage('registering');
        setIsPassword(false);
        setHistory(prev => [...prev, 'Registering user...']);
        setTimeout(() => {
            if (userDB.current[tempUser]) {
                setHistory(prev => [...prev, `... [REGISTRATION FAILED] Username '${tempUser}' already exists.`]);
            } else {
                userDB.current[tempUser] = currentInputValue;
                setHistory(prev => [...prev, `... [REGISTRATION SUCCESSFUL] User '${tempUser}' created.`]);
            }
            setTempUser('');
            setTimeout(() => setStage('prompt'), 1000);
        }, 2000);
        break;
    }
  };

  const getCurrentPrompt = () => {
    switch (stage) {
      case 'login-user': return 'username:';
      case 'login-pass': return 'password:';
      case 'register-user': return 'new username:';
      case 'register-pass': return 'password:';
      case 'prompt': return '>';
      default: return '';
    }
  };
  
  const showInput = ['prompt', 'login-user', 'login-pass', 'register-user', 'register-pass'].includes(stage);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-base" onClick={() => inputRef.current?.focus()}>
      <div className="max-w-4xl overflow-x-auto">
        <pre className="whitespace-pre">
          {stage === 'booting' ? (
              bootText.map((line, index) => (
                  <div key={index}>
                    {line}
                    {isBooting && index === bootText.length - 1 && <span className="blinking-cursor">▋</span>}
                  </div>
              ))
          ) : (
            history.map((line, index) => (
                <div key={index}>{line}</div>
            ))
          )}
        </pre>
        {showInput && (
            <form onSubmit={handleFormSubmit} className="flex items-center">
              <span>{getCurrentPrompt()}&nbsp;</span>
              <input
                  ref={inputRef}
                  type={isPassword ? 'password' : 'text'}
                  value={inputValue}
                  onChange={handleInputChange}
                  size={Math.max(1, inputValue.length)}
                  autoFocus
                  spellCheck="false"
                  autoComplete="off"
                  className="bg-transparent border-none outline-none text-matrix-green p-0"
              />
               <span className="blinking-cursor">▋</span>
            </form>
        )}
      </div>
    </div>
  );
};

const happyCodingMessage = ['HAPPY CODING ;)'];

const TransitionScreen: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const onTypingComplete = useCallback(() => {
    setTimeout(onComplete, 1200); // Pause for a moment after typing
  }, [onComplete]);

  const { displayedText, isTyping } = useTypingEffect(happyCodingMessage, 150, onTypingComplete);

  return (
    <div className="min-h-screen flex items-center justify-center bg-matrix-darker">
      <h1 className="text-4xl sm:text-6xl text-glow">
        {displayedText[0]}
        {isTyping && <span className="blinking-cursor">▋</span>}
      </h1>
    </div>
  );
};


type AppStage = 'landing' | 'transition' | 'main';

const App: React.FC = () => {
  const [appStage, setAppStage] = useState<AppStage>('landing');
  const [code, setCode] = useState<string>('');
  const [explanation, setExplanation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [activeAction, setActiveAction] = useState<ActionType>(ActionType.Explain);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAction = useCallback(async (action: ActionType) => {
    if (!code.trim()) {
      setError("Please input some code before choosing an action.");
      return;
    }
    setError('');
    setIsLoading(true);
    setExplanation('');
    setActiveAction(action);

    try {
      const result = await processCode(code, action);
      setExplanation(result);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [code]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCode(text);
      };
      reader.readAsText(file);
    }
  };
  
  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogout = () => {
    // Reset state for a clean login
    setCode('');
    setExplanation('');
    setError('');
    setActiveAction(ActionType.Explain);
    setAppStage('landing');
  };

  if (appStage === 'landing') {
    return <LandingPage onLogin={() => setAppStage('transition')} />;
  }

  if (appStage === 'transition') {
    return <TransitionScreen onComplete={() => setAppStage('main')} />;
  }

  return (
    <div className="min-h-screen flex flex-col p-4 sm:p-6 lg:p-8 space-y-6">
      <header className="flex justify-between items-center text-matrix-green">
        <div className="flex items-center space-x-3 text-glow">
          <LogoIcon className="w-6 h-6" />
          <h1 className="text-2xl">RunThru</h1>
        </div>
        <nav className="flex items-center space-x-4 text-sm">
          <a href="#" className="hover:text-white transition-colors">My History</a>
          <span>Welcome, User</span>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 px-3 py-1 border border-matrix-green/50 rounded-md hover:bg-matrix-green/10 hover:border-matrix-green transition-colors">
            <LogoutIcon className="w-4 h-4" />
            <span>Logout</span>
          </button>
          <button className="p-1 hover:text-white transition-colors">
            <SyncIcon className="w-5 h-5" />
          </button>
        </nav>
      </header>

      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Code Input Panel */}
        <div className="flex flex-col space-y-4 bg-matrix-dark p-4 rounded-lg glowing-border">
          <div className="text-glow">
            <h2 className="text-lg">Code Input</h2>
            <p className="text-xs text-matrix-green/70">//HAPPY CODING</p>
          </div>
          <div className="flex-1 p-2 rounded-md border border-matrix-green/30 relative min-h-[300px]">
            <CodeMirror
              value={code}
              onChange={(value) => setCode(value)}
              theme={okaidia}
              extensions={[javascript({ jsx: true })]}
              basicSetup={{
                lineNumbers: true,
                foldGutter: false,
                autocompletion: true,
                highlightActiveLine: true,
              }}
              placeholder=">your code here..."
            />
          </div>
          <div className="flex items-center space-x-2">
             <ActionButton
              icon={<ExplainIcon className="w-4 h-4" />}
              label={ActionType.Explain}
              isActive={activeAction === ActionType.Explain}
              onClick={() => handleAction(ActionType.Explain)}
              isLoading={isLoading}
            />
             <ActionButton
              icon={<RefactorIcon className="w-4 h-4" />}
              label={ActionType.Refactor}
              isActive={activeAction === ActionType.Refactor}
              onClick={() => handleAction(ActionType.Refactor)}
              isLoading={isLoading}
            />
             <ActionButton
              icon={<DebugIcon className="w-4 h-4" />}
              label={ActionType.Debug}
              isActive={activeAction === ActionType.Debug}
              onClick={() => handleAction(ActionType.Debug)}
              isLoading={isLoading}
            />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".js,.ts,.py,.java,.c,.cpp,.cs,.go,.html,.css,.json,.md" />
            <button onClick={handleUploadClick} disabled={isLoading} className="flex items-center justify-center space-x-2 px-4 py-2 text-sm transition-all duration-300 rounded-md border bg-transparent border-matrix-green/50 text-matrix-green hover:bg-matrix-green/10 hover:border-matrix-green disabled:opacity-50 disabled:cursor-not-allowed">
              <UploadIcon className="w-4 h-4" />
              <span>Upload</span>
            </button>
          </div>
        </div>

        {/* Explanation Panel */}
        <div className="flex flex-col bg-matrix-dark p-4 rounded-lg glowing-border">
          <h2 className="text-lg text-glow mb-4">Explanation</h2>
          <div className="flex-1 flex flex-col items-center justify-center text-center text-matrix-green/70 relative overflow-y-auto">
            {isLoading && (
              <div className="flex flex-col items-center space-y-2">
                  <SyncIcon className="w-8 h-8 animate-spin" />
                  <span>Processing with Gemini...</span>
              </div>
            )}
            {error && <p className="text-red-400">{error}</p>}
            {!isLoading && !explanation && !error && (
               <div className="flex flex-col items-center space-y-2">
                 <div className="p-3 rounded-full border-2 border-matrix-green/50">
                    <CodeBracketsIcon className="w-6 h-6 text-glow" />
                 </div>
                 <p>Your code explanation will appear here.</p>
                 <p className="text-xs">// Get started by pasting code and selecting an action.</p>
              </div>
            )}
            {explanation && (
              <div className="text-left w-full h-full overflow-y-auto text-sm text-matrix-green/90 p-2">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return match ? (
                        <SyntaxHighlighter
                          style={customSyntaxStyle as any}
                          language={match[1]}
                          PreTag="div"
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={`${className || ''} bg-matrix-darker p-1 rounded-md`} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {explanation}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;