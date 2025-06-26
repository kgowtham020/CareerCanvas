const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware.js');
const { analyzeAts, getInterviewQuestions, getAnswerFeedback } = require('../controllers/ai.controller.js');

// All routes are protected and require a valid token
router.post('/analyze-ats', authMiddleware, analyzeAts);
router.post('/interview-prep', authMiddleware, getInterviewQuestions);
router.post('/feedback', authMiddleware, getAnswerFeedback); // The new endpoint

module.exports = router;