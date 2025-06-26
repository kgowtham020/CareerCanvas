const mongoose = require('mongoose');

// We create sub-schemas for repeatable data like experience and education
const ExperienceSchema = new mongoose.Schema({
    title: String,
    company: String,
    location: String,
    start: String,
    end: String,
    description: String,
});

const EducationSchema = new mongoose.Schema({
    school: String,
    degree: String,
    field: String,
    start: String,
    end: String,
});

const ProjectSchema = new mongoose.Schema({
    name: String,
    technologies: String,
    description: String,
    url: String,
});

// This is the main profile schema
const ProfileSchema = new mongoose.Schema({
    // This creates a link to the User model. Every profile belongs to one user.
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    phone: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    website: { type: String, default: '' },
    summary: { type: String, default: '' },
    skills: { type: [String], default: [] },
    experience: { type: [ExperienceSchema], default: [] },
    education: { type: [EducationSchema], default: [] },
    projects: { type: [ProjectSchema], default: [] },
}, {
    timestamps: true,
});

const Profile = mongoose.model('Profile', ProfileSchema);
module.exports = Profile;