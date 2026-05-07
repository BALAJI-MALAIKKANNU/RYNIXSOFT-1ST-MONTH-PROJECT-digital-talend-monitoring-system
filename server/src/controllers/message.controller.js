const Message = require('../models/Message');
const User = require('../models/User');

exports.getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUser = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    const messages = await Message.find({
      $or: [
        { sender: currentUser._id, receiver: userId },
        { sender: userId, receiver: currentUser._id }
      ]
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const currentUser = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    const newMessage = new Message({
      sender: currentUser._id,
      receiver: receiverId,
      content
    });

    await newMessage.save();

    // Emit to receiver if connected
    const io = req.app.get('io');
    if (io) {
      io.to(receiverId.toString()).emit('receive_message', await Message.findById(newMessage._id).populate('sender', 'fullName avatar'));
    }

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
