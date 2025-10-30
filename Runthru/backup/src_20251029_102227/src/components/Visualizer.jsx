import React, { useState, useEffect, useRef, useCallback } from 'react';
import Sketch from 'react-p5';

const Visualizer = ({ visualData }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(3000); // milliseconds per step
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const speechSynthesis = useRef(null);
  const currentUtterance = useRef(null);
  const p5Ref = useRef(null);
  const animationRef = useRef(null);

  // Initialize when visualData changes
  useEffect(() => {
    if (visualData && visualData.steps && visualData.steps.length > 0) {
      setCurrentStepIndex(0);
      setIsPlaying(false);
      setIsInitialized(true);
      // Force redraw when new data arrives
      if (p5Ref.current) {
        p5Ref.current.redraw();
      }
    }
  }, [visualData]);

  // Initialize speech synthesis
  useEffect(() => {
    if ('speechSynthesis' in window) {
      speechSynthesis.current = window.speechSynthesis;
    }
  }, []);

  // Auto-play through steps
  useEffect(() => {
    if (isPlaying && visualData && visualData.steps && currentStepIndex < visualData.steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, playbackSpeed);
      
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStepIndex >= (visualData?.steps?.length || 0) - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStepIndex, visualData, playbackSpeed]);

  // Auto-play audio when step changes
  useEffect(() => {
    if (visualData && visualData.steps && visualData.steps[currentStepIndex] && isInitialized) {
      playStepAudio(visualData.steps[currentStepIndex].audioDescription);
      // Force redraw for new step
      if (p5Ref.current) {
        p5Ref.current.redraw();
      }
    }
  }, [currentStepIndex, visualData, isInitialized]);

  const playStepAudio = useCallback((text) => {
    if (!speechSynthesis.current || !text) return;

    // Stop any current audio
    if (currentUtterance.current) {
      speechSynthesis.current.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8; // Slower for better comprehension
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    
    utterance.onstart = () => setIsAudioPlaying(true);
    utterance.onend = () => setIsAudioPlaying(false);
    utterance.onerror = () => setIsAudioPlaying(false);
    
    currentUtterance.current = utterance;
    speechSynthesis.current.speak(utterance);
  }, []);

  const setup = useCallback((p5, canvasParentRef) => {
    p5.createCanvas(900, 700).parent(canvasParentRef); // Increased height from 600 to 700
    p5Ref.current = p5;
    p5.noLoop();
  }, []);

  const draw = useCallback((p5) => {
    // Clear canvas
    p5.clear();
    
    // Clean background with gradient
    const gradient = p5.drawingContext.createLinearGradient(0, 0, 0, p5.height);
    if (document.documentElement.classList.contains('dark')) {
      gradient.addColorStop(0, '#1a1a2e');
      gradient.addColorStop(1, '#16213e');
    } else {
      gradient.addColorStop(0, '#f8fafc');
      gradient.addColorStop(1, '#e2e8f0');
    }
    p5.drawingContext.fillStyle = gradient;
    p5.drawingContext.fillRect(0, 0, p5.width, p5.height);

    if (!visualData || !visualData.steps || visualData.steps.length === 0) {
      drawNoData(p5);
      return;
    }

    // Draw header section
    drawHeader(p5, visualData);

    // Draw main visualization area (increased height)
    drawMainVisualization(p5, visualData, currentStepIndex);

    // Draw step information panel (moved down)
    drawStepPanel(p5, visualData, currentStepIndex);

    // Draw progress bar (moved down)
    drawProgressBar(p5, visualData, currentStepIndex);
  }, [visualData, currentStepIndex]);

  const drawNoData = useCallback((p5) => {
    p5.fill(100);
    if (document.documentElement.classList.contains('dark')) {
      p5.fill(200);
    }
    p5.textSize(18);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text('No visualization data available', p5.width / 2, p5.height / 2 - 20);
    p5.textSize(14);
    p5.text('Submit code for a dry run!', p5.width / 2, p5.height / 2 + 10);
  }, []);

  const drawHeader = useCallback((p5, visualData) => {
    // Title with background
    p5.fill(255, 255, 255, 0.1);
    p5.rect(20, 20, p5.width - 40, 80, 10);
    
    p5.fill(0);
    if (document.documentElement.classList.contains('dark')) {
      p5.fill(255);
    }
    p5.textSize(24);
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.text(visualData.title || 'Algorithm Visualization', 40, 30);

    p5.textSize(16);
    p5.text(visualData.description || '', 40, 60);

    // Complexity info
    p5.textSize(14);
    p5.fill(100);
    if (document.documentElement.classList.contains('dark')) {
      p5.fill(200);
    }
    p5.text(visualData.complexity || '', 40, 85);
  }, []);

  const drawMainVisualization = useCallback((p5, visualData, stepIndex) => {
    const currentStep = visualData.steps[stepIndex];
    if (!currentStep) return;

    // Main visualization area (increased height for text labels)
    const vizX = 20;
    const vizY = 120;
    const vizWidth = p5.width - 40;
    const vizHeight = 350; // Increased from 300 to 350

    // Background for visualization
    p5.fill(255, 255, 255, 0.05);
    p5.rect(vizX, vizY, vizWidth, vizHeight, 10);

    // Draw based on algorithm type
    switch (visualData.type) {
      case 'dynamicProgramming':
        drawDynamicProgramming(p5, visualData, stepIndex, vizX, vizY, vizWidth, vizHeight);
        break;
      case 'arrayTraversal':
        drawArrayTraversal(p5, visualData, stepIndex, vizX, vizY, vizWidth, vizHeight);
        break;
      case 'binarySearch':
        drawBinarySearch(p5, visualData, stepIndex, vizX, vizY, vizWidth, vizHeight);
        break;
      case 'sorting':
        drawSorting(p5, visualData, stepIndex, vizX, vizY, vizWidth, vizHeight);
        break;
      default:
        drawGenericAlgorithm(p5, visualData, stepIndex, vizX, vizY, vizWidth, vizHeight);
    }
  }, []);

  const drawDynamicProgramming = useCallback((p5, visualData, stepIndex, x, y, width, height) => {
    const currentStep = visualData.steps[stepIndex];
    const dpTable = currentStep.arrays[0] || [];
    
    if (dpTable.length === 0) return;

    const cellSize = Math.min(50, width / dpTable[0].length, height / dpTable.length);
    const startX = x + (width - dpTable[0].length * cellSize) / 2;
    const startY = y + (height - dpTable.length * cellSize) / 2;

    // Draw DP table
    p5.textSize(14);
    p5.textAlign(p5.CENTER, p5.CENTER);
    
    for (let i = 0; i < dpTable.length; i++) {
      for (let j = 0; j < dpTable[i].length; j++) {
        const cellX = startX + j * cellSize;
        const cellY = startY + i * cellSize;

        // Cell background
        p5.fill(255, 255, 255, 0.1);
        p5.stroke(100, 100, 100, 0.3);
        p5.rect(cellX, cellY, cellSize, cellSize, 5);

        // Highlight current cell
        if (currentStep.highlight && currentStep.highlight.includes(`${i},${j}`)) {
          p5.fill(255, 200, 0, 0.3);
          p5.rect(cellX, cellY, cellSize, cellSize, 5);
        }

        // Cell value
        p5.fill(0);
        if (document.documentElement.classList.contains('dark')) {
          p5.fill(255);
        }
        p5.text(dpTable[i][j], cellX + cellSize / 2, cellY + cellSize / 2);
      }
    }
  }, []);

  const drawArrayTraversal = useCallback((p5, visualData, stepIndex, x, y, width, height) => {
    const currentStep = visualData.steps[stepIndex];
    const array = currentStep.arrays[0] || visualData.input || [];
    
    if (array.length === 0) return;

    const cellSize = Math.min(60, width / array.length);
    const startX = x + (width - array.length * cellSize) / 2;
    const startY = y + height / 2 - cellSize / 2;

    p5.textSize(16);
    p5.textAlign(p5.CENTER, p5.CENTER);

    for (let i = 0; i < array.length; i++) {
      const cellX = startX + i * cellSize;
      const cellY = startY;

      // Cell background
      p5.fill(255, 255, 255, 0.1);
      p5.stroke(100, 100, 100, 0.3);
      p5.rect(cellX, cellY, cellSize, cellSize, 8);

      // Highlight current index with more prominent colors
      if (currentStep.highlight && currentStep.highlight.includes(i)) {
        // Strong highlight background
        p5.fill(255, 200, 0, 0.6); // More opaque yellow
        p5.stroke(255, 150, 0, 0.8); // Orange border
        p5.strokeWeight(3); // Thicker border
        p5.rect(cellX, cellY, cellSize, cellSize, 8);
        p5.strokeWeight(1); // Reset stroke weight
      }

      // Cell value with better contrast
      p5.fill(0);
      if (document.documentElement.classList.contains('dark')) {
        p5.fill(255);
      }
      p5.text(array[i], cellX + cellSize / 2, cellY + cellSize / 2);

      // Index label with more space and better positioning
      p5.fill(100);
      if (document.documentElement.classList.contains('dark')) {
        p5.fill(200);
      }
      p5.textSize(12);
      p5.text(`Index ${i}`, cellX + cellSize / 2, cellY + cellSize + 20);
      
      // Value label below index
      p5.textSize(10);
      p5.fill(150);
      if (document.documentElement.classList.contains('dark')) {
        p5.fill(180);
      }
      p5.text(`Value: ${array[i]}`, cellX + cellSize / 2, cellY + cellSize + 35);
    }
  }, []);

  const drawBinarySearch = useCallback((p5, visualData, stepIndex, x, y, width, height) => {
    const currentStep = visualData.steps[stepIndex];
    const array = currentStep.arrays[0] || visualData.input || [];
    
    if (array.length === 0) return;

    const cellSize = Math.min(50, width / array.length);
    const startX = x + (width - array.length * cellSize) / 2;
    const startY = y + height / 2 - cellSize / 2;

    p5.textSize(14);
    p5.textAlign(p5.CENTER, p5.CENTER);

    for (let i = 0; i < array.length; i++) {
      const cellX = startX + i * cellSize;
      const cellY = startY;

      // Cell background
      p5.fill(255, 255, 255, 0.1);
      p5.stroke(100, 100, 100, 0.3);
      p5.rect(cellX, cellY, cellSize, cellSize, 5);

      // Highlight based on binary search state with more prominent colors
      if (currentStep.highlight) {
        if (currentStep.highlight.includes(`mid:${i}`)) {
          p5.fill(255, 200, 0, 0.6); // Middle element - bright yellow
          p5.stroke(255, 150, 0, 0.8);
          p5.strokeWeight(3);
        } else if (currentStep.highlight.includes(`left:${i}`)) {
          p5.fill(100, 255, 100, 0.6); // Left boundary - bright green
          p5.stroke(50, 200, 50, 0.8);
          p5.strokeWeight(3);
        } else if (currentStep.highlight.includes(`right:${i}`)) {
          p5.fill(255, 100, 100, 0.6); // Right boundary - bright red
          p5.stroke(200, 50, 50, 0.8);
          p5.strokeWeight(3);
        }
        p5.rect(cellX, cellY, cellSize, cellSize, 5);
        p5.strokeWeight(1); // Reset stroke weight
      }

      // Cell value
      p5.fill(0);
      if (document.documentElement.classList.contains('dark')) {
        p5.fill(255);
      }
      p5.text(array[i], cellX + cellSize / 2, cellY + cellSize / 2);

      // Index label
      p5.fill(100);
      if (document.documentElement.classList.contains('dark')) {
        p5.fill(200);
      }
      p5.textSize(12);
      p5.text(`Index ${i}`, cellX + cellSize / 2, cellY + cellSize + 15);
      
      // Value label
      p5.textSize(10);
      p5.fill(150);
      if (document.documentElement.classList.contains('dark')) {
        p5.fill(180);
      }
      p5.text(`Value: ${array[i]}`, cellX + cellSize / 2, cellY + cellSize + 30);
    }
  }, []);

  const drawSorting = useCallback((p5, visualData, stepIndex, x, y, width, height) => {
    const currentStep = visualData.steps[stepIndex];
    const array = currentStep.arrays[0] || visualData.input || [];
    
    if (array.length === 0) return;

    const cellSize = Math.min(50, width / array.length);
    const startX = x + (width - array.length * cellSize) / 2;
    const startY = y + height / 2 - cellSize / 2;

    p5.textSize(14);
    p5.textAlign(p5.CENTER, p5.CENTER);

    for (let i = 0; i < array.length; i++) {
      const cellX = startX + i * cellSize;
      const cellY = startY;

      // Cell background
      p5.fill(255, 255, 255, 0.1);
      p5.stroke(100, 100, 100, 0.3);
      p5.rect(cellX, cellY, cellSize, cellSize, 5);

      // Highlight based on sorting state with more prominent colors
      if (currentStep.highlight) {
        if (currentStep.highlight.includes(`comparing:${i}`)) {
          p5.fill(255, 200, 0, 0.6); // Comparing - bright yellow
          p5.stroke(255, 150, 0, 0.8);
          p5.strokeWeight(3);
        } else if (currentStep.highlight.includes(`swapping:${i}`)) {
          p5.fill(255, 100, 100, 0.6); // Swapping - bright red
          p5.stroke(200, 50, 50, 0.8);
          p5.strokeWeight(3);
        } else if (currentStep.highlight.includes(`sorted:${i}`)) {
          p5.fill(100, 255, 100, 0.6); // Sorted - bright green
          p5.stroke(50, 200, 50, 0.8);
          p5.strokeWeight(3);
        }
        p5.rect(cellX, cellY, cellSize, cellSize, 5);
        p5.strokeWeight(1); // Reset stroke weight
      }

      // Cell value
      p5.fill(0);
      if (document.documentElement.classList.contains('dark')) {
        p5.fill(255);
      }
      p5.text(array[i], cellX + cellSize / 2, cellY + cellSize / 2);

      // Index label
      p5.fill(100);
      if (document.documentElement.classList.contains('dark')) {
        p5.fill(200);
      }
      p5.textSize(12);
      p5.text(`Index ${i}`, cellX + cellSize / 2, cellY + cellSize + 15);
      
      // Value label
      p5.textSize(10);
      p5.fill(150);
      if (document.documentElement.classList.contains('dark')) {
        p5.fill(180);
      }
      p5.text(`Value: ${array[i]}`, cellX + cellSize / 2, cellY + cellSize + 30);
    }
  }, []);

  const drawGenericAlgorithm = useCallback((p5, visualData, stepIndex, x, y, width, height) => {
    const currentStep = visualData.steps[stepIndex];
    
    if (currentStep.arrays && currentStep.arrays.length > 0) {
      const array = currentStep.arrays[0];
      const cellSize = Math.min(50, width / array.length);
      const startX = x + (width - array.length * cellSize) / 2;
      const startY = y + height / 2 - cellSize / 2;

      p5.textSize(14);
      p5.textAlign(p5.CENTER, p5.CENTER);

      for (let i = 0; i < array.length; i++) {
        const cellX = startX + i * cellSize;
        const cellY = startY;

        // Cell background
        p5.fill(255, 255, 255, 0.1);
        p5.stroke(100, 100, 100, 0.3);
        p5.rect(cellX, cellY, cellSize, cellSize, 5);

        // Highlight if specified with more prominent colors
        if (currentStep.highlight && currentStep.highlight.includes(i)) {
          p5.fill(255, 200, 0, 0.6); // Bright yellow highlight
          p5.stroke(255, 150, 0, 0.8);
          p5.strokeWeight(3);
          p5.rect(cellX, cellY, cellSize, cellSize, 5);
          p5.strokeWeight(1); // Reset stroke weight
        }

        // Cell value
        p5.fill(0);
        if (document.documentElement.classList.contains('dark')) {
          p5.fill(255);
        }
        p5.text(array[i], cellX + cellSize / 2, cellY + cellSize / 2);

        // Index label
        p5.fill(100);
        if (document.documentElement.classList.contains('dark')) {
          p5.fill(200);
        }
        p5.textSize(12);
        p5.text(`Index ${i}`, cellX + cellSize / 2, cellY + cellSize + 15);
        
        // Value label
        p5.textSize(10);
        p5.fill(150);
        if (document.documentElement.classList.contains('dark')) {
          p5.fill(180);
        }
        p5.text(`Value: ${array[i]}`, cellX + cellSize / 2, cellY + cellSize + 30);
      }
    }
  }, []);

  const drawStepPanel = useCallback((p5, visualData, stepIndex) => {
    const currentStep = visualData.steps[stepIndex];
    if (!currentStep) return;

    const panelX = 20;
    const panelY = 490; // Moved down from 440 to 490
    const panelWidth = p5.width - 40;
    const panelHeight = 120;

    // Panel background
    p5.fill(255, 255, 255, 0.05);
    p5.rect(panelX, panelY, panelWidth, panelHeight, 10);

    // Step information
    p5.textAlign(p5.LEFT, p5.TOP);
    p5.fill(0);
    if (document.documentElement.classList.contains('dark')) {
      p5.fill(255);
    }

    // Step number and operation
    p5.textSize(18);
    p5.text(`Step ${currentStep.step}: ${currentStep.operation}`, panelX + 20, panelY + 15);

    // Description
    p5.textSize(14);
    p5.text(currentStep.description, panelX + 20, panelY + 40);

    // Code line
    p5.textSize(12);
    p5.fill(100);
    if (document.documentElement.classList.contains('dark')) {
      p5.fill(200);
    }
    p5.text(`Code: ${currentStep.codeLine}`, panelX + 20, panelY + 60);

    // Variables
    if (Object.keys(currentStep.variables).length > 0) {
      p5.textSize(12);
      p5.fill(100);
      if (document.documentElement.classList.contains('dark')) {
        p5.fill(200);
      }
      const varText = Object.entries(currentStep.variables)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');
      p5.text(`Variables: ${varText}`, panelX + 20, panelY + 80);
    }

    // Audio status
    p5.textSize(12);
    p5.fill(isAudioPlaying ? '#10b981' : '#6b7280');
    p5.text(isAudioPlaying ? '🔊 Playing audio...' : '🔇 Audio ready', panelX + 20, panelY + 100);
  }, [isAudioPlaying]);

  const drawProgressBar = useCallback((p5, visualData, stepIndex) => {
    if (!visualData.steps) return;

    const barX = 20;
    const barY = 630; // Moved down from 580 to 630
    const barWidth = p5.width - 40;
    const barHeight = 8;

    // Background bar
    p5.fill(255, 255, 255, 0.1);
    p5.rect(barX, barY, barWidth, barHeight, 4);

    // Progress bar
    const progress = (stepIndex + 1) / visualData.steps.length;
    p5.fill(59, 130, 246, 0.8);
    p5.rect(barX, barY, barWidth * progress, barHeight, 4);

    // Progress text
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.textSize(12);
    p5.fill(100);
    if (document.documentElement.classList.contains('dark')) {
      p5.fill(200);
    }
    p5.text(`${stepIndex + 1} / ${visualData.steps.length}`, p5.width / 2, barY + 20);
  }, []);

  const nextStep = useCallback(() => {
    if (visualData && visualData.steps && currentStepIndex < visualData.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  }, [visualData, currentStepIndex]);

  const prevStep = useCallback(() => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  }, [currentStepIndex]);

  const togglePlay = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
    if (speechSynthesis.current) {
      speechSynthesis.current.cancel();
    }
  }, []);

  const replayAudio = useCallback(() => {
    if (visualData && visualData.steps && visualData.steps[currentStepIndex]) {
      playStepAudio(visualData.steps[currentStepIndex].audioDescription);
    }
  }, [visualData, currentStepIndex, playStepAudio]);

  if (!visualData || !visualData.steps || visualData.steps.length === 0) {
    return (
      <div className="w-full h-96 flex justify-center items-center bg-gray-200 dark:bg-gray-900 rounded-lg overflow-hidden">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">No visualization data available</p>
          <p className="text-sm text-gray-500 dark:text-gray-500">Submit code for a dry run!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Controls Panel */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {visualData.title || 'Algorithm Visualization'}
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Step {currentStepIndex + 1} of {visualData.steps?.length || 0}
            </span>
          </div>
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={prevStep}
            disabled={currentStepIndex === 0}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={togglePlay}
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <button
            onClick={nextStep}
            disabled={!visualData.steps || currentStepIndex >= visualData.steps.length - 1}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            Next
          </button>
          <button
            onClick={replayAudio}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
          >
            🔊 Replay Audio
          </button>
        </div>

        {/* Speed Control */}
        <div className="flex items-center justify-center space-x-2">
          <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
            className="px-3 py-1 border rounded-lg text-sm bg-white dark:bg-gray-700"
          >
            <option value={2000}>Slow</option>
            <option value={3000}>Normal</option>
            <option value={4000}>Fast</option>
          </select>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="w-full h-[700px] flex justify-center items-center bg-gray-200 dark:bg-gray-900 rounded-lg overflow-hidden">
        <Sketch
          setup={setup}
          draw={draw}
        />
      </div>
    </div>
  );
};

export default Visualizer;