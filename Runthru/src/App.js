import React, { useState, useEffect, useContext } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import CodeEditor from './components/CodeEditor';
import ExplanationBox from './components/ExplanationBox';
import AudioPlayer from './components/AudioPlayer';
import Visualizer from './components/Visualizer';
import Auth from './components/Auth';
import History from './components/History';
import UploadBox from './components/UploadBox';
import { AuthContext } from './context/AuthContext';
import axios from './services/api';
import { motion } from 'framer-motion';

const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:5000';

function App() {
  const [code, setCode] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [visualData, setVisualData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const [outputType, setOutputType] = useState('explanation');
  const [outputContent, setOutputContent] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.add(savedTheme);
    } else {
      // Default to light theme if no preference is saved
      document.documentElement.classList.add('light');
    }
  }, []);

  // Toggles between light and dark themes
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.remove(theme);
    document.documentElement.classList.add(newTheme);
  };

  // Handles code explanation request
  const handleExplainCode = async () => {
    setLoading(true);
    setError('');
    setOutputType('explanation');
    setOutputContent('');
    setAudioUrl('');
    setVisualData(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${SERVER_URL}/api/explain`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutputContent(response.data.explanation);
      setAudioUrl(response.data.audioUrl);
      setVisualData(response.data.visualData);
    } catch (err) {
      console.error('Error explaining code:', err);
      setError(err.response?.data?.message || 'Failed to explain code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handles file upload for code explanation
  const handleFileUpload = async (file) => {
    setLoading(true);
    setError('');
    setOutputType('explanation');
    setOutputContent('');
    setAudioUrl('');
    setVisualData(null);

    const formData = new FormData();
    formData.append('codeFile', file);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${SERVER_URL}/api/explain/upload`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );
      setCode(response.data.code); // Set code from uploaded file
      setOutputContent(response.data.explanation);
      setAudioUrl(response.data.audioUrl);
      setVisualData(response.data.visualData);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handles code refactoring request
  const handleRefactorCode = async () => {
    setLoading(true);
    setError('');
    setOutputType('refactor');
    setOutputContent('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${SERVER_URL}/api/explain/refactor`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutputContent(response.data.refactoredCode);
    } catch (err) {
      console.error('Error refactoring code:', err);
      setError(err.response?.data?.message || 'Failed to get refactoring suggestions.');
    } finally {
      setLoading(false);
    }
  };

  // Handles code debugging request
  const handleDebugCode = async () => {
    setLoading(true);
    setError('');
    setOutputType('debug');
    setOutputContent('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${SERVER_URL}/api/explain/debug`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutputContent(response.data.debugInfo);
    } catch (err) {
      console.error('Error debugging code:', err);
      setError(err.response?.data?.message || 'Failed to get debugging assistance.');
    } finally {
      setLoading(false);
    }
  };

  // Handles dry run request
  const handleDryRun = async () => {
    setLoading(true);
    setError('');
    setOutputType('dryrun');
    setOutputContent('');
    setAudioUrl('');
    setVisualData(null);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${SERVER_URL}/api/explain/dryrun`,
        { code },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOutputContent(response.data.explanation);
      setAudioUrl(response.data.audioUrl);
      setVisualData(response.data.visualData);
    } catch (err) {
      console.error('Error generating dry run:', err);
      setError(err.response?.data?.message || 'Failed to generate dry run. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handles user logout
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-700 text-gray-900 dark:text-gray-100 font-poppins transition-colors duration-500">
      <nav className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-md py-4 px-6 flex justify-between items-center sticky top-0 z-50">
        <Link to="/" className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-jetbrains-mono">RunThru</Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/history" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">My History</Link>
              <span className="text-sm">Welcome, {user.username}</span>
              <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">Login</Link>
              <Link to="/register" className="px-4 py-2 border border-blue-500 text-blue-500 rounded-md hover:bg-blue-500 hover:text-white transition-colors">Register</Link>
            </>
          )}
          <button onClick={toggleTheme} className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors">
            {theme === 'light' ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>

      <div className="container mx-auto p-6">
        <Routes>
          <Route path="/login" element={<Auth type="login" />} />
          <Route path="/register" element={<Auth type="register" />} />
          <Route path="/history" element={user ? <History setCode={setCode} setAudioUrl={setAudioUrl} setVisualData={setVisualData} /> : <p className="text-center text-red-500">Please log in to view history.</p>} />
          <Route path="/" element={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-1 flex flex-col space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg glassmorphism">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Code Input</h2>
                  <CodeEditor value={code} onChange={setCode} />
                  <div className="mt-4 flex flex-wrap gap-4">
                    <button
                      onClick={handleExplainCode}
                      disabled={loading || !code.trim()}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading && outputType === 'explanation' ? 'Explaining...' : 'Explain Code'}
                    </button>
                    <UploadBox onFileUpload={handleFileUpload} disabled={loading} />
                    <button
                      onClick={handleRefactorCode}
                      disabled={loading || !code.trim()}
                      className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading && outputType === 'refactor' ? 'Refactoring...' : 'Refactor Code'}
                    </button>
                    <button
                      onClick={handleDebugCode}
                      disabled={loading || !code.trim()}
                      className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading && outputType === 'debug' ? 'Debugging...' : 'Debug Code'}
                    </button>
                    <button
                      onClick={handleDryRun}
                      disabled={loading || !code.trim()}
                      className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading && outputType === 'dryrun' ? 'Generating Dry Run...' : 'Dry Run'}
                    </button>
                  </div>
                  {error && <p className="text-red-500 mt-4">{error}</p>}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-1 flex flex-col space-y-6"
              >
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg glassmorphism flex-grow">
                  <ExplanationBox explanation={outputContent} loading={loading} type={outputType} />
                  {outputType === 'explanation' && outputContent && (
                    <AudioPlayer audioUrl={audioUrl} explanation={outputContent} />
                  )}
                </div>
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg glassmorphism flex-grow">
                  <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Dry Run Visualization</h2>
                  <Visualizer visualData={visualData} />
                </div>
              </motion.div>
            </div>
          } />
        </Routes>
      </div>
    </div>
  );
}

export default App;