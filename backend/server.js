require('dotenv').config(); 
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors()); 
app.use(express.json()); 

const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
.then(() => console.log("MongoDB connection successful!"))
.catch(err => console.error("MongoDB connection error:", err));

// --- API Routes ---
const authRoutes = require('./routes/auth.routes.js');
const profileRoutes = require('./routes/profile.routes.js');
const resumeRoutes = require('./routes/resume.routes.js');
const aiRoutes = require('./routes/ai.routes.js');

app.use('/api/auth', authRoutes); // This line makes /api/auth/register work
app.use('/api/profile', profileRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

// --- Server Start ---
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running on port ${port}`));