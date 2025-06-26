const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth.middleware.js');
const { getProfile, updateProfile } = require('../controllers/profile.controller.js');

// This route will be protected.
// When a GET request is made to /api/profile/, it first runs authMiddleware.
// If the middleware succeeds, it then runs the getProfile function.
router.get('/', authMiddleware, getProfile);

// This route is also protected and handles creating or updating a profile.
router.post('/', authMiddleware, updateProfile);

module.exports = router;