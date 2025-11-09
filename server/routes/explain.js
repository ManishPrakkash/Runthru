const express = require('express');
const router = express.Router();
const explainController = require('../controllers/explainController');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const upload = multer({ dest: uploadDir });

// @route   POST /api/explain
// @desc    Get AI explanation, audio, and visual data for code snippet
// @access  Public (auth optional - if logged in, saves to history)
router.post('/', explainController.explainCode);

// @route   POST /api/explain/upload
// @desc    Upload code file for explanation
// @access  Public (auth optional - if logged in, saves to history)
router.post('/upload', upload.single('codeFile'), explainController.uploadCode);

// @route   POST /api/explain/refactor
// @desc    Get AI refactoring suggestions for code
// @access  Public (auth optional)
router.post('/refactor', explainController.refactorCode);

// @route   POST /api/explain/debug
// @desc    Get AI debugging assistance for code
// @access  Public (auth optional)
router.post('/debug', explainController.debugCode);

// ...existing code...
// @route   POST /api/explain/dryrun
// @desc    Get dry run steps and audio for code
// @access  Public (auth optional - if logged in, saves to history)
router.post('/dryrun', explainController.dryRunCode);
module.exports = router;
