const Team = require('../models/Team');
const User = require('../models/User');

exports.createTeam = async (req, res) => {
  try {
    const { name, description, limit, members } = req.body;
    
    const adminUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create teams' });
    }

    const newTeam = new Team({
      name,
      description,
      limit: limit || 50,
      createdBy: adminUser._id,
      members: Array.isArray(members) ? members : []
    });

    await newTeam.save();
    
    const populatedTeam = await Team.findById(newTeam._id)
      .populate('members', 'fullName email avatar')
      .populate('createdBy', 'fullName');
      
    res.status(201).json(populatedTeam);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ error: 'Team name already exists' });
    res.status(500).json({ error: err.message });
  }
};

exports.getTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('members', 'fullName email avatar').populate('createdBy', 'fullName');
    res.json(teams);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    
    if (team.members.length >= team.limit) {
      return res.status(400).json({ error: `Team has reached its maximum limit of ${team.limit} members` });
    }
    
    if (team.members.includes(userId)) {
      return res.status(400).json({ error: 'User is already in this team' });
    }

    team.members.push(userId);
    await team.save();
    
    res.json(await Team.findById(id).populate('members', 'fullName email avatar'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { id, userId } = req.params;
    
    const team = await Team.findById(id);
    if (!team) return res.status(404).json({ error: 'Team not found' });
    
    team.members = team.members.filter(m => m.toString() !== userId);
    await team.save();
    
    res.json(await Team.findById(id).populate('members', 'fullName email avatar'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    await Team.findByIdAndDelete(id);
    res.json({ message: 'Team deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
