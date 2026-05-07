const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team.controller');
const verifyToken = require('../middleware/verifyToken');

router.post('/', verifyToken, teamController.createTeam);
router.get('/', verifyToken, teamController.getTeams);
router.post('/:id/members', verifyToken, teamController.addMember);
router.delete('/:id/members/:userId', verifyToken, teamController.removeMember);
router.delete('/:id', verifyToken, teamController.deleteTeam);

module.exports = router;
