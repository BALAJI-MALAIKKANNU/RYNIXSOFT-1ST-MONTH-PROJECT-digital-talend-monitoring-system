const Task = require('../models/Task');
const User = require('../models/User');

exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;
    
    const adminUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can create tasks' });
    }

    if (assignedTo === 'all') {
      const allUsers = await User.find({ role: 'user' });
      const bulkTasks = allUsers.map(u => ({
        title,
        description,
        assignedTo: u._id,
        assignedBy: adminUser._id,
        dueDate
      }));
      const newTasks = await Task.insertMany(bulkTasks);
      const io = req.app.get('io');
      if (io) io.emit('new_task', { title, message: 'Mass task assigned to all users!' });
      return res.status(201).json(newTasks[0] || {}); // UI expects an object or array to trigger fetch
    }

    const newTask = new Task({
      title,
      description,
      assignedTo,
      assignedBy: adminUser._id,
      dueDate
    });

    await newTask.save();
    const io = req.app.get('io');
    if (io) io.emit('new_task', { title, message: 'A new task was assigned!' });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const currentUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    let tasks;
    if (currentUser.role === 'admin') {
      tasks = await Task.find().populate('assignedTo', 'fullName email avatar').populate('assignedBy', 'fullName').sort({ createdAt: -1 });
    } else {
      tasks = await Task.find({ assignedTo: currentUser._id }).populate('assignedBy', 'fullName email').sort({ createdAt: -1 });
    }
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const adminUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can edit tasks' });
    }

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    const adminUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Only admins can delete tasks' });
    }

    await Task.findByIdAndDelete(id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.submitTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { submissionText, submissionNote } = req.body;
    const submissionFiles = req.files ? req.files.map(f => `/uploads/${f.filename}`) : [];
    
    const currentUser = await User.findOne({ firebaseUid: req.user.uid });
    
    const task = await Task.findById(id);
    if (!task) return res.status(404).json({ error: 'Task not found' });
    
    if (task.assignedTo.toString() !== currentUser._id.toString()) {
      return res.status(403).json({ error: 'Not authorized to submit this task' });
    }

    if (submissionText) task.submissionText = submissionText;
    if (submissionNote) task.submissionNote = submissionNote;
    if (submissionFiles.length > 0) task.submissionFiles = submissionFiles;
    task.submittedAt = new Date();
    task.status = 'needs_review';
    await task.save();

    res.json({ message: 'Task submitted for review', task });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
