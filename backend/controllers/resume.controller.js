const Resume = require('../models/Resume.model.js');

// --- Create a new resume ---
const createResume = async (req, res) => {
    try {
        const { title, templateId, profile, ...styleOptions } = req.body;
        const newResume = new Resume({
            user: req.user.id, // req.user.id comes from our authMiddleware
            title,
            templateId,
            profile,
            ...styleOptions,
        });
        const savedResume = await newResume.save();
        res.status(201).json(savedResume);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Get all resumes for the logged-in user ---
const getResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ user: req.user.id }).sort({ updatedAt: -1 });
        res.json(resumes);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Get a single resume by its ID ---
const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findById(req.params.id);
        if (!resume) {
            return res.status(404).json({ msg: 'Resume not found' });
        }
        // Security check: ensure the resume belongs to the logged-in user
        if (resume.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }
        res.json(resume);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Update a resume ---
const updateResume = async (req, res) => {
    try {
        let resume = await Resume.findById(req.params.id);
        if (!resume) return res.status(404).json({ msg: 'Resume not found' });

        // Security check
        if (resume.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        resume = await Resume.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
        res.json(resume);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

// --- Delete a resume ---
const deleteResume = async (req, res) => {
    try {
        let resume = await Resume.findById(req.params.id);
        if (!resume) return res.status(404).json({ msg: 'Resume not found' });

        // Security check
        if (resume.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await Resume.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Resume removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = { createResume, getResumes, getResumeById, updateResume, deleteResume };