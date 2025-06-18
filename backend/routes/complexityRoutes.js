const express = require('express');
const router = express.Router();
const { analyzeCode} = require('../controllers/complexityController');

// Route to analyze code
router.post('/analyze', analyzeCode);

module.exports = router;
