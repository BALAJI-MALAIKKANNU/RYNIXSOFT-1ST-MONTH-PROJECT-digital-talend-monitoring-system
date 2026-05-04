const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({ firebaseUid: req.user.uid }).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const adminUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can fetch user lists' });
    }
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const adminUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can modify roles' });
    }
    const { id } = req.params;
    const { role } = req.body;
    
    if (!['admin', 'user'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role configuration' });
    }
    
    const user = await User.findByIdAndUpdate(id, { role }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, bio, avatar, phone, department, skills } = req.body;
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { fullName, bio, avatar, phone, department, skills },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAvatar = async (req, res) => {
  try {
    // Expected to run after a multer middleware that uploads to cloudinary (or stores URL from frontend)
    // For simplicity, we can accept the Cloudinary URL from the frontend.
    const { avatarUrl } = req.body;
    const user = await User.findOneAndUpdate(
      { firebaseUid: req.user.uid },
      { avatar: avatarUrl },
      { new: true }
    ).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
