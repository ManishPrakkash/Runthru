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
// @access  Private
router.post('/', authMiddleware, explainController.explainCode);

// @route   POST /api/explain/upload
// @desc    Upload code file for explanation
// @access  Private
router.post('/upload', authMiddleware, upload.single('codeFile'), explainController.uploadCode);

// @route   POST /api/explain/refactor
// @desc    Get AI refactoring suggestions for code
// @access  Private
router.post('/refactor', authMiddleware, explainController.refactorCode);

// @route   POST /api/explain/debug
// @desc    Get AI debugging assistance for code
// @access  Private
router.post('/debug', authMiddleware, explainController.debugCode);

// ...existing code...
// @route   POST /api/explain/dryrun
// @desc    Get dry run steps and audio for code
// @access  Private
router.post('/dryrun', authMiddleware, explainController.dryRunCode);
module.exports = router;
