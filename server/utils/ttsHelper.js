const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

// Browser-based TTS using Web Speech API (no external dependencies)
exports.synthesizeSpeechToFile = async (text, filePath) => {
  // For server-side, we'll create a simple text file with the speech content
  // The frontend will handle the actual TTS using browser APIs
  try {
    const speechData = {
      text: text,
      timestamp: new Date().toISOString(),
      duration: Math.ceil(text.length * 0.1) // Rough estimate: 0.1 seconds per character
    };
    
    await fs.writeFile(filePath.replace('.mp3', '.json'), JSON.stringify(speechData, null, 2));
    
    // Create a dummy audio file for compatibility
    const dummyAudioPath = filePath;
    await fs.writeFile(dummyAudioPath, 'dummy audio content');
    
    console.log(`✅ Speech data saved: ${filePath}`);
    return true;
  } catch (error) {
    console.error('❌ Error saving speech data:', error);
    throw error;
  }
};

// Legacy function for compatibility
exports.generateAudio = (text, outputPath) => {
  return exports.synthesizeSpeechToFile(text, outputPath);
};

// New function to get speech data for frontend TTS
exports.getSpeechData = async (filePath) => {
  try {
    const jsonPath = filePath.replace('.mp3', '.json');
    const data = await fs.readFile(jsonPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Error reading speech data:', error);
    return null;
  }
};

