const aiService = require('../services/aiService');

exports.generateTaskDescription = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const description = await aiService.generateTaskDescription(title);
    res.json({ description });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.suggestDeadline = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) return res.status(400).json({ error: 'Description is required' });
    const suggestion = await aiService.suggestDeadline(description);
    res.json(suggestion);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkSubmission = async (req, res) => {
  try {
    const { taskTitle, submissionNote } = req.body;
    const review = await aiService.checkSubmission(taskTitle, submissionNote);
    res.json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.generateBio = async (req, res) => {
  try {
    const { name, currentBio } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const bio = await aiService.generateBio(name, currentBio);
    res.json({ bio });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.recommendSkills = async (req, res) => {
  try {
    const { department, bio } = req.body;
    const skills = await aiService.recommendSkills(department || '', bio || '');
    res.json({ skills });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
