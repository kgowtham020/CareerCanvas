const express = require('express');
const router = express.Router();

router.post('/analyze', async (req, res) => {
  const { jobDescription, resumeContent } = req.body;

  try {
    // Mocked response, replace with actual API integration
    res.json({
      matchScore: 85,
      skills: {
        present: ['JavaScript', 'React', 'CSS'],
        missing: ['Python', 'AWS'],
      },
      eligibility: {
        roles: ['Frontend Developer', 'UI Developer'],
        batch: ['2023', '2024', '2025'],
        degree: ['B.Tech', 'MCA', 'BCA'],
      },
      suggestions: [
        'Add Python to your skills section.',
        'Highlight AWS experience in your projects.',
        'Use action verbs like "developed" or "designed".',
      ],
      keywords: [
        { term: 'JavaScript', present: true },
        { term: 'Python', present: false },
        { term: 'React', present: true },
      ],
    });
  } catch (error) {
    console.error('ATS analysis error:', error);
    res.status(500).json({ message: 'Analysis failed' });
  }
});

module.exports = router;
