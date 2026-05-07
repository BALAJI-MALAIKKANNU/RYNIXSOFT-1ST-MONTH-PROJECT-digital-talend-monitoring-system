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

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const currentUser = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    const message = await Message.findById(id);
    if (!message) return res.status(404).json({ error: 'Message not found' });

    if (message.sender.toString() !== currentUser._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized to delete this message' });
    }

    message.isDeleted = true;
    message.content = '🚫 This message was deleted';
    await message.save();

    const io = req.app.get('io');
    if (io) {
      io.to(message.receiver.toString()).emit('message_deleted', message._id);
      io.to(message.sender.toString()).emit('message_deleted', message._id);
    }

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    const { userId } = req.params; // The sender whose messages we are reading
    const currentUser = await User.findOne({ firebaseUid: req.user.uid });
    
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    await Message.updateMany(
      { sender: userId, receiver: currentUser._id, read: false },
      { $set: { read: true } }
    );

    const io = req.app.get('io');
    if (io) {
      // Notify the sender that their messages were read
      io.to(userId.toString()).emit('messages_read', { readerId: currentUser._id });
    }

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUnreadCount = async (req, res) => {
  try {
    const currentUser = await User.findOne({ firebaseUid: req.user.uid });
    if (!currentUser) return res.status(404).json({ error: 'User not found' });

    const unreadCounts = await Message.aggregate([
      { $match: { receiver: currentUser._id, read: false } },
      { $group: { _id: "$sender", count: { $sum: 1 } } }
    ]);

    const formattedCounts = {};
    unreadCounts.forEach(item => {
      formattedCounts[item._id] = item.count;
    });

    res.json(formattedCounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
