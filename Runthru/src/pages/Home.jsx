import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import ExplanationBox from '../components/ExplanationBox';
import AudioPlayer from '../components/AudioPlayer';
import Visualizer from '../components/Visualizer';
import UploadBox from '../components/UploadBox';
import { motion } from 'framer-motion';
import * as explainService from '../services/explainService'; // Import explainService

const HomePage = () => {
  const [code, setCode] = useState('');
  const [explanation, setExplanation] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [visualData, setVisualData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for replay data from history page
    const replayData = sessionStorage.getItem('replayData');
    if (replayData) {
      const item = JSON.parse(replayData);
      setCode(item.code);
      setExplanation(item.explanation);
      setAudioUrl(item.audioUrl);
      setVisualData(item.visualData);
      sessionStorage.removeItem('replayData'); // Clear after use
    }
  }, []);

  const handleExplainCode = async () => {
    setLoading(true);
    setError('');
    setExplanation('');
    setAudioUrl('');
    setVisualData(null);

    try {
      const token = localStorage.getItem('token');
      const response = await explainService.explainCode(code, token);
      setExplanation(response.explanation);
      setAudioUrl(response.audioUrl);
      setVisualData(response.visualData);
    } catch (err) {
      console.error('Error explaining code:', err);
      setError(err.message || 'Failed to explain code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError('');
    setExplanation('');
    setAudioUrl('');
    setVisualData(null);

    try {
      const token = localStorage.getItem('token');
      const response = await explainService.uploadCodeFile(file, token);
      setCode(response.code); // Set code from uploaded file
      setExplanation(response.explanation);
      setAudioUrl(response.audioUrl);
      setVisualData(response.visualData);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.message || 'Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefactorCode = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await explainService.refactorCode(code, token);
      alert('Refactoring Suggestion:\n' + response.refactoredCode);
    } catch (err) {
      console.error('Error refactoring code:', err);
      setError(err.message || 'Failed to get refactoring suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const handleDebugCode = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await explainService.debugCode(code, token);
      alert('Debugging Assistant:\n' + response.debugInfo);
    } catch (err) {
      console.error('Error debugging code:', err);
      setError(err.message || 'Failed to get debugging assistance.');
    } finally {
      setLoading(false);
    }
  };

  return (
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
              {loading ? 'Explaining...' : 'Explain Code'}
            </button>
            <UploadBox onFileUpload={handleFileUpload} disabled={loading} />
            <button
              onClick={handleRefactorCode}
              disabled={loading || !code.trim()}
              className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Refactoring...' : 'Refactor Code'}
            </button>
            <button
              onClick={handleDebugCode}
              disabled={loading || !code.trim()}
              className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Debugging...' : 'Debug Code'}
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
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Explanation</h2>
          <ExplanationBox explanation={explanation} loading={loading} />
          {audioUrl && <AudioPlayer audioUrl={audioUrl} />}
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg glassmorphism flex-grow">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Dry Run Visualization</h2>
          <Visualizer visualData={visualData} />
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;