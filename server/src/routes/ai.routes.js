const express = require('express');
const router = express.Router();
const aiController = require('../controllers/ai.controller');
const verifyToken = require('../middleware/verifyToken');

router.post('/generate-description', verifyToken, aiController.generateTaskDescription);
router.post('/suggest-deadline', verifyToken, aiController.suggestDeadline);
router.post('/check-submission', verifyToken, aiController.checkSubmission);
router.post('/generate-bio', verifyToken, aiController.generateBio);
router.post('/recommend-skills', verifyToken, aiController.recommendSkills);

module.exports = router;
