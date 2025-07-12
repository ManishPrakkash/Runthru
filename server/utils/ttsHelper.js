const { spawn } = require('child_process');
const path = require('path');

exports.generateAudio = (text, outputPath) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.join(__dirname, 'generate_audio.py');
    const process = spawn('python', [scriptPath, text, outputPath]);
    process.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error('TTS generation failed'));
    });
  });
};




// // server/utils/ttsHelper.js
// const { exec } = require('child_process');
// const path = require('path');
// const fs = require('fs').promises;

// // Ensure the public/audio directory exists
// const audioPublicDir = path.join(__dirname, '../public/audio');
// fs.mkdir(audioPublicDir, { recursive: true }).catch(err => {
//   if (err.code !== 'EEXIST') { // Ignore if directory already exists
//     console.error('Error creating audio directory:', err);
//   }
// });

// exports.synthesizeSpeechToFile = async (text, filePath) => {
//   // Path to the Python script that will handle TTS
//   const pythonScriptPath = path.join(__dirname, 'generate_audio.py');

//   // Escape text for command line argument (basic escaping for simple text)
//   // For more complex text, consider writing to a temporary file and passing its path
//   const escapedText = JSON.stringify(text); // Safely quote the text

//   // Construct the command to execute the Python script
//   // Assumes 'python' command is in the system's PATH
//   const command = `python "${pythonScriptPath}" ${escapedText} "${filePath}"`;

//   console.log(`Executing TTS command: ${command}`);

//   return new Promise((resolve, reject) => {
//     exec(command, (error, stdout, stderr) => {
//       if (error) {
//         console.error(`exec error: ${error}`);
//         console.error(`stdout: ${stdout}`);
//         console.error(`stderr: ${stderr}`);
//         return reject(new Error(`Failed to synthesize speech: ${stderr || stdout || error.message}`));
//       }
//       if (stderr) {
//         console.warn(`TTS Python script stderr: ${stderr}`);
//       }
//       console.log(`TTS Python script stdout: ${stdout}`);
//       resolve();
//     });
//   });
// };

