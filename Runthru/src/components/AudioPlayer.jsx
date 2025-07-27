import React, { useState, useEffect } from 'react';

const AudioPlayer = ({ audioUrl, explanation }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [speechSynthesis, setSpeechSynthesis] = useState(null);

  useEffect(() => {
    // Check if browser supports speech synthesis
    if ('speechSynthesis' in window) {
      setIsSupported(true);
      setSpeechSynthesis(window.speechSynthesis);
    }
  }, []);

  const handlePlay = () => {
    if (!speechSynthesis || !explanation) return;

    if (isPlaying) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(explanation);
      utterance.rate = 0.9; // Slightly slower for better comprehension
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);
      
      speechSynthesis.speak(utterance);
    }
  };

  const handleStop = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsPlaying(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="mt-4 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg shadow-inner">
        <h3 className="text-lg font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
          Audio Playback Not Supported
        </h3>
        <p className="text-yellow-700 dark:text-yellow-300">
          Your browser doesn't support text-to-speech. Please read the explanation above.
        </p>
      </div>
    );
  }

  if (!explanation) {
    return null;
  }

  return (
    <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-inner">
      <h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
        Listen to Explanation:
      </h3>
      <div className="flex items-center space-x-4">
        <button
          onClick={handlePlay}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isPlaying
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button
          onClick={handleStop}
          className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors"
        >
          Stop
        </button>
        <div className="flex-1">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {isPlaying ? 'Playing explanation...' : 'Click Play to hear the explanation'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
