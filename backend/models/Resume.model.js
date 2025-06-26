const mongoose = require('mongoose');

// This defines the schema for our saved Resume documents.
const ResumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        default: 'Untitled Resume',
    },
    templateId: {
        type: String,
        required: true,
        default: 'odyssey',
    },
    // --- Style Controls ---
    fontSize: { type: String, default: 'base' },
    fontFamily: { type: String, default: 'sans' },
    accentColor: { type: String, default: '#3b82f6' },

    // --- Content Snapshot ---
    // We store a copy of the profile data as it was when the resume was saved.
    profile: {
        name: String,
        email: String,
        phone: String,
        linkedin: String,
        github: String,
        website: String,
        summary: String,
        skills: [String],
        experience: Array,
        education: Array,
        projects: Array,
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt
});

const Resume = mongoose.model('Resume', ResumeSchema);
module.exports = Resume;