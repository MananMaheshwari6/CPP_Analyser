const express = require('express');
const router = express.Router();
const { analyzeCode, getHistory } = require('../controllers/complexityController');

router.post('/analyze', analyzeCode);
router.get('/history', getHistory);

module.exports = router;
