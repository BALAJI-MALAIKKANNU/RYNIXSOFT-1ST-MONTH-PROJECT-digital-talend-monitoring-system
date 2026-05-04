require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

mongoose.connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log('Connected DB');
    const user = await User.findOne();
    if (!user) {
      console.log('No user');
      return process.exit(0);
    }
    console.log('Before bio:', user.bio);
    const updated = await User.findOneAndUpdate(
      { _id: user._id },
      { bio: 'New backend test bio', department: 'Testing Dept' },
      { new: true }
    );
    console.log('After bio:', updated.bio, 'Dept:', updated.department);
    process.exit(0);
  });
