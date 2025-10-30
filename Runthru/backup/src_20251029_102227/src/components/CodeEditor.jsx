import React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { cpp } from '@codemirror/lang-cpp';
import { python } from '@codemirror/lang-python';
import { javascript } from '@codemirror/lang-javascript';
import { dracula } from '@uiw/codemirror-theme-dracula'; // ✅ ADD THIS
import { githubLight } from '@uiw/codemirror-theme-github'; // ✅ ADD THIS

const CodeEditor = ({ value, onChange }) => {
  const getLanguageExtension = (code) => {
    if (code.includes('#include') || code.includes('int main') || code.includes('std::')) {
      return cpp();
    }
    if (code.includes('def ') || code.includes('import ') || code.includes('print(')) {
      return python();
    }
    return javascript(); // Default to JavaScript
  };

  const currentExtension = getLanguageExtension(value);

  const currentTheme = document.documentElement.classList.contains('dark')
    ? dracula
    : githubLight;

  return (
    <div className="code-editor-container">
      <CodeMirror
        value={value}
        height="300px"
        extensions={[currentExtension]}
        onChange={onChange}
        theme={currentTheme}
        basicSetup={{
          lineNumbers: true,
          lineWrapping: true,
          tabSize: 2,
        }}
      />
    </div>
  );
};

export default CodeEditor;
