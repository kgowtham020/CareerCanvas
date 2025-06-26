const express = require('express');
const router = express.Router();

// GET all resumes
router.get('/', async (req, res) => {
  try {
    res.json([
      { _id: '1', title: 'Resume 1', content: 'Sample resume content' },
      { _id: '2', title: 'Resume 2', content: 'Another resume content' },
    ]);
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({ message: 'Failed to fetch resumes' });
  }
});

// GET a single resume by ID
router.get('/:id', async (req, res) => {
  try {
    res.json({ _id: req.params.id, title: 'Resume', content: 'Sample content' });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({ message: 'Failed to get resume' });
  }
});

// POST a new resume
router.post('/', async (req, res) => {
  try {
    res.status(201).json({ _id: 'new_id', ...req.body });
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(400).json({ message: 'Failed to create resume' });
  }
});

// PUT to update a resume
router.put('/:id', async (req, res) => {
  try {
    res.json({ _id: req.params.id, ...req.body });
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({ message: 'Failed to update resume' });
  }
});

// DELETE a resume
router.delete('/:id', async (req, res) => {
  try {
    res.json({ message: 'Resume deleted successfully' });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({ message: 'Failed to delete resume' });
  }
});

module.exports = router;
