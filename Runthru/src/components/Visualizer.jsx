import React from 'react';
import Sketch from 'react-p5';

const Visualizer = ({ visualData }) => {
  const setup = (p5, canvasParentRef) => {
    p5.createCanvas(600, 300).parent(canvasParentRef);
    p5.noLoop(); // We will draw only when data changes or explicitly
  };

  const draw = (p5) => {
    p5.background(240, 240, 240); // Light background for the canvas
    if (document.documentElement.classList.contains('dark')) {
        p5.background(40, 40, 40); // Dark background in dark mode
    }

    if (visualData && visualData.type === 'arrayTraversal' && visualData.array && visualData.steps) {
      const arr = visualData.array;
      const currentStepIndex = visualData.currentStepIndex || 0;
      const currentStep = visualData.steps[currentStepIndex];

      const cellSize = 50;
      const startX = (p5.width - arr.length * cellSize) / 2;
      const startY = p5.height / 2 - cellSize / 2;

      for (let i = 0; i < arr.length; i++) {
        const x = startX + i * cellSize;
        const y = startY;

        // Draw cell background
        p5.fill(255); // White background for cells
        if (document.documentElement.classList.contains('dark')) {
            p5.fill(60); // Darker background in dark mode
        }
        p5.stroke(100);
        p5.rect(x, y, cellSize, cellSize, 5); // Rounded rectangles

        // Highlight current index
        if (currentStep && currentStep.index === i) {
          p5.fill(255, 200, 0, 150); // Amber highlight
          if (document.documentElement.classList.contains('dark')) {
              p5.fill(100, 100, 255, 150); // Blue highlight in dark mode
          }
          p5.rect(x, y, cellSize, cellSize, 5);
        }

        // Draw value
        p5.fill(0); // Black text
        if (document.documentElement.classList.contains('dark')) {
            p5.fill(255); // White text in dark mode
        }
        p5.textSize(20);
        p5.textAlign(p5.CENTER, p5.CENTER);
        p5.text(arr[i], x + cellSize / 2, y + cellSize / 2);

        // Draw index below
        p5.fill(100);
        if (document.documentElement.classList.contains('dark')) {
            p5.fill(200);
        }
        p5.textSize(12);
        p5.text(i, x + cellSize / 2, y + cellSize + 15);
      }

      // Display current step description
      if (currentStep && currentStep.description) {
        p5.fill(0);
        if (document.documentElement.classList.contains('dark')) {
            p5.fill(255);
        }
        p5.textSize(16);
        p5.textAlign(p5.LEFT, p5.TOP);
        p5.text(`Step ${currentStepIndex + 1}: ${currentStep.description}`, 20, 20);
      }

    } else if (visualData) {
      // Handle other types of visualData or display a message
      p5.fill(0);
      if (document.documentElement.classList.contains('dark')) {
            p5.fill(255);
      }
      p5.textSize(16);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('Visualization data received, but not yet implemented.', p5.width / 2, p5.height / 2);
    } else {
      p5.fill(100);
      if (document.documentElement.classList.contains('dark')) {
            p5.fill(200);
      }
      p5.textSize(16);
      p5.textAlign(p5.CENTER, p5.CENTER);
      p5.text('No visualization data available. Submit code for a dry run!', p5.width / 2, p5.height / 2);
    }
  };

  // Re-draw the canvas when visualData changes
  const sketchRef = React.useRef();
  React.useEffect(() => {
    if (sketchRef.current) {
      sketchRef.current.redraw(); // Trigger p5.js redraw
    }
  }, [visualData]);


  return (
    <div className="w-full h-80 flex justify-center items-center bg-gray-200 dark:bg-gray-900 rounded-lg overflow-hidden">
      <Sketch setup={(p5, parent) => {
          sketchRef.current = p5; // Store p5 instance
          setup(p5, parent);
      }} draw={draw} />
    </div>
  );
};

export default Visualizer;