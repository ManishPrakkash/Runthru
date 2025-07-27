const gptHelper = require('../utils/gptHelper');
const ttsHelper = require('../utils/ttsHelper');
const History = require('../models/History');

const fs = require('fs').promises;

const path = require('path');
const { spawn } = require('child_process');

// Helper to determine code language
const getLanguageFromCode = (code) => {
  if (code.includes('#include') || code.includes('int main') || code.includes('std::')) {
    return 'C++';
  }
  if (code.includes('def ') || code.includes('import ') || code.includes('print(')) {
    return 'Python';
  }
  return 'JavaScript';
};

// 🚨 Check if auth middleware passed user
const getUserId = (req) => {
  if (!req.user || !req.user.id) {
    console.error('❌ No user attached to request. Check auth middleware.');
    throw new Error('Unauthorized: Missing user info');
  }
  return req.user.id;
};

exports.explainCode = async (req, res) => {
  const { code } = req.body;

  console.log('📩 Incoming explain request');
  console.log('🔐 Authorization Header:', req.headers.authorization);

  if (!code) {
    return res.status(400).json({ message: 'Code snippet is required.' });
  }

  let userId;
  try {
    userId = getUserId(req);
    console.log('✅ Authenticated User ID:', userId);
  } catch (authErr) {
    return res.status(401).json({ message: authErr.message });
  }

  try {
    const language = getLanguageFromCode(code);
    const explanation = await gptHelper.getExplanation(code, language);

    let audioUrl = '';
    try {
      const audioFileName = `explanation-${Date.now()}.mp3`;
      const audioFilePath = path.join(__dirname, '../public/audio', audioFileName);
      await ttsHelper.synthesizeSpeechToFile(explanation, audioFilePath);
      audioUrl = `/audio/${audioFileName}`;
    } catch (ttsError) {
      console.error('⚠️ TTS failed:', ttsError.message);
    }

    let visualData = null;
    if (code.includes('for') && code.includes('array')) {
      visualData = {
        type: 'arrayTraversal',
        array: [10, 20, 30, 40, 50],
        steps: [
          { index: 0, description: 'Starting at index 0' },
          { index: 1, description: 'Moving to next element' },
          { index: 2, description: 'Checking condition' },
          { index: 3, description: 'Element found!' },
          { index: 4, description: 'End of traversal' },
        ],
        currentStepIndex: 0
      };
    }

    const historyEntry = new History({
      userId,
      code,
      language,
      explanation,
      audioUrl: audioUrl || null,
      visualData: visualData || null
    });
    await historyEntry.save();

    res.json({ explanation, audioUrl, visualData });

  } catch (err) {
    console.error('❌ Error in explainCode:', err);
    res.status(500).json({ message: 'Failed to process code explanation. ' + err.message });
  }
};

exports.uploadCode = async (req, res) => {
  console.log('📁 Uploading file:', req.file);

  let userId;
  try {
    userId = getUserId(req);
    console.log('✅ Authenticated User ID:', userId);
  } catch (authErr) {
    return res.status(401).json({ message: authErr.message });
  }

  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  try {
    const code = await fs.readFile(req.file.path, 'utf8');
    await fs.unlink(req.file.path);

    const language = getLanguageFromCode(code);
    const explanation = await gptHelper.getExplanation(code, language);

    let audioUrl = '';
    try {
      const audioFileName = `explanation-${Date.now()}.mp3`;
      const audioFilePath = path.join(__dirname, '../public/audio', audioFileName);
      await ttsHelper.synthesizeSpeechToFile(explanation, audioFilePath);
      audioUrl = `/audio/${audioFileName}`;
    } catch (ttsError) {
      console.error('⚠️ TTS failed:', ttsError.message);
    }

    let visualData = null;
    if (code.includes('for') && code.includes('array')) {
      visualData = {
        type: 'arrayTraversal',
        array: [10, 20, 30, 40, 50],
        steps: [
          { index: 0, description: 'Starting at index 0' },
          { index: 1, description: 'Moving to next element' },
          { index: 2, description: 'Checking condition' },
          { index: 3, description: 'Element found!' },
          { index: 4, description: 'End of traversal' },
        ],
        currentStepIndex: 0
      };
    }

    const historyEntry = new History({
      userId,
      code,
      language,
      explanation,
      audioUrl: audioUrl || null,
      visualData: visualData || null
    });
    await historyEntry.save();

    res.json({ code, explanation, audioUrl, visualData });

  } catch (err) {
    console.error('❌ Error processing uploaded file:', err.message);
    if (req.file?.path) {
      await fs.unlink(req.file.path).catch((e) => console.error('Error deleting file:', e.message));
    }
    res.status(500).json({ message: 'Failed to process uploaded file. ' + err.message });
  }
};

// Refactor
exports.refactorCode = async (req, res) => {
  const { code } = req.body;

  let userId;
  try {
    userId = getUserId(req);
  } catch (authErr) {
    return res.status(401).json({ message: authErr.message });
  }

  if (!code) {
    return res.status(400).json({ message: 'Code snippet is required for refactoring.' });
  }

  try {
    const language = getLanguageFromCode(code);
    const refactoredCode = await gptHelper.getRefactoringSuggestions(code, language);
    res.json({ refactoredCode });
  } catch (err) {
    console.error('❌ Error in refactorCode:', err.message);
    res.status(500).json({ message: 'Failed to get refactoring suggestions. ' + err.message });
  }
};

// Debug
exports.debugCode = async (req, res) => {
  const { code } = req.body;

  let userId;
  try {
    userId = getUserId(req);
  } catch (authErr) {
    return res.status(401).json({ message: authErr.message });
  }

  if (!code) {
    return res.status(400).json({ message: 'Code snippet is required for debugging.' });
  }

  try {
    const language = getLanguageFromCode(code);
    const debugInfo = await gptHelper.getDebuggingAssistance(code, language);
    res.json({ debugInfo });
  } catch (err) {
    console.error('❌ Error in debugCode:', err.message);
    res.status(500).json({ message: 'Failed to get debugging assistance. ' + err.message });
  }
};

exports.dryRunCode = async (req, res) => {
  const { code } = req.body;

  let userId;
  try {
    userId = getUserId(req);
  } catch (authErr) {
    return res.status(401).json({ message: authErr.message });
  }

  if (!code) {
    return res.status(400).json({ message: 'Code snippet is required for dry run.' });
  }

  try {
    const language = getLanguageFromCode(code);
    
    // Analyze code and generate dry run steps
    const dryRunData = await gptHelper.generateDryRunSteps(code, language);
    
    // Generate comprehensive explanation for the entire dry run
    const stepExplanations = dryRunData.steps.map((step, idx) => 
      `Step ${idx + 1}: ${step.audioDescription}`
    );
    
    const fullExplanation = `Dry Run Analysis: ${dryRunData.title}. ${dryRunData.description}. ${stepExplanations.join('. ')}. Final output: ${dryRunData.output}. Time complexity: ${dryRunData.complexity}.`;
    
    // Generate audio for the full explanation
    const audioFileName = `dryrun_${Date.now()}.mp3`;
    const audioFilePath = path.join(__dirname, '../public/audio', audioFileName);
    
    try {
      await ttsHelper.synthesizeSpeechToFile(fullExplanation, audioFilePath);
    } catch (ttsError) {
      console.error('⚠️ TTS failed for dry run:', ttsError.message);
    }

    // Save to history
    const historyEntry = new History({
      userId,
      code,
      language,
      explanation: fullExplanation,
      audioUrl: `/audio/${audioFileName}`,
      visualData: dryRunData
    });
    await historyEntry.save();

    res.json({
      visualData: dryRunData,
      audioUrl: `/audio/${audioFileName}`,
      explanation: fullExplanation
    });

  } catch (err) {
    console.error('❌ Error in dryRunCode:', err);
    res.status(500).json({ message: 'Failed to generate dry run. ' + err.message });
  }
};

