import React, { useState, useEffect } from 'react';
import CodeEditor from '../components/CodeEditor';
import ExplanationBox from '../components/ExplanationBox';
// import AudioPlayer from '../components/AudioPlayer';
// import Visualizer from '../components/Visualizer';
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
  const [outputType, setOutputType] = useState('explanation');
  const [outputContent, setOutputContent] = useState('');

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
    setOutputType('explanation');
    setOutputContent('');
    setAudioUrl('');
    setVisualData(null);
    try {
      const response = await explainService.explainCode(code);
      setOutputContent(response.explanation);
      setAudioUrl(response.audioUrl);
      setVisualData(response.visualData);
    } catch (err) {
      console.error('Error explaining code:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to explain code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file) => {
    setLoading(true);
    setError('');
    setOutputType('explanation');
    setOutputContent('');
    setAudioUrl('');
    setVisualData(null);
    try {
      const response = await explainService.uploadCodeFile(file);
      setCode(response.code);
      setOutputContent(response.explanation);
      setAudioUrl(response.audioUrl);
      setVisualData(response.visualData);
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to upload file. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefactorCode = async () => {
    setLoading(true);
    setError('');
    setOutputType('refactor');
    setOutputContent('');
    try {
      const response = await explainService.refactorCode(code);
      setOutputContent(response.refactoredCode);
    } catch (err) {
      console.error('Error refactoring code:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to get refactoring suggestions.');
    } finally {
      setLoading(false);
    }
  };

  const handleDebugCode = async () => {
    setLoading(true);
    setError('');
    setOutputType('debug');
    setOutputContent('');
    try {
      const response = await explainService.debugCode(code);
      setOutputContent(response.debugInfo);
    } catch (err) {
      console.error('Error debugging code:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to get debugging assistance.');
    } finally {
      setLoading(false);
    }
  };

  const handleDryRun = () => {
    setError('Dry Run feature is temporarily disabled.');
  };



  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left: Code Input and Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-1 flex flex-col space-y-6"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg glassmorphism flex flex-col h-full">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Code Input</h2>
          <CodeEditor value={code} onChange={setCode} />
          <div className="mt-4 flex flex-col gap-4">
            <div className="flex flex-wrap gap-4 overflow-x-auto" style={{maxWidth: '100%'}}>
              <button
                onClick={handleExplainCode}
                disabled={loading || !code.trim()}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Explain Code'}
              </button>
              <UploadBox onFileUpload={handleFileUpload} disabled={loading} />
              <button
                onClick={handleRefactorCode}
                disabled={loading || !code.trim()}
                className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Refactor Code'}
              </button>
              <button
                onClick={handleDebugCode}
                disabled={loading || !code.trim()}
                className="px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Debug Code'}
              </button>
              {/* Dry Run button should always be visible. If not, check CSS or parent container size. */}
              {/* Dry Run button temporarily removed */}
            </div>
            {/* Dry Run Step Controls */}
            {outputType === 'dryrun' && visualData && (
              <div className="flex gap-2 mt-2">
                <button
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                  onClick={() => setVisualData(v => ({ ...v, currentStepIndex: Math.max(0, (v.currentStepIndex || 0) - 1) }))}
                >Previous</button>
                <button
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-700 rounded hover:bg-gray-400 dark:hover:bg-gray-600"
                  onClick={() => setVisualData(v => ({ ...v, currentStepIndex: Math.min(v.steps.length - 1, (v.currentStepIndex || 0) + 1) }))}
                >Next</button>
              </div>
            )}
          </div>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
      </motion.div>

      {/* Middle: Dry Run Visualization - temporarily hidden */}
      {false && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1 flex flex-col space-y-6"
        >
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg glassmorphism flex-grow flex flex-col items-center justify-center">
            <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Dry Run Visualization</h2>
            <Visualizer visualData={visualData} />
            {/* Optionally, play audio for dryrun */}
          {/* {audioUrl && outputType === 'dryrun' && <AudioPlayer audioUrl={audioUrl} />} */}
          </div>
        </motion.div>
      )}

      {/* Right: Explanation Output */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="lg:col-span-1 flex flex-col space-y-6"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg glassmorphism flex-grow">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Explanation Output</h2>
          <ExplanationBox explanation={outputContent} loading={loading} type={outputType} />
          {/* {audioUrl && outputType === 'explanation' && <AudioPlayer audioUrl={audioUrl} />} */}
        </div>
      </motion.div>
    </div>
  );
};

export default HomePage;