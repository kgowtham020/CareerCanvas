const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../controllers/auth.controller.js');

// Defines the route for POST /api/auth/register
router.post('/register', registerUser);

// Defines the route for POST /api/auth/login
router.post('/login', loginUser);

module.exports = router;