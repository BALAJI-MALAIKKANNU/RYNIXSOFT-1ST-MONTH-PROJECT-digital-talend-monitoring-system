require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User');

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOne();
  console.log("Current user bio:", user.bio);
  
  // Simulate the exact query
  const res = await User.findOneAndUpdate(
    { firebaseUid: user.firebaseUid },
    { fullName: user.fullName, bio: "Testing bio from api sim", avatar: "http://av.com", phone: "123", department: "IT", skills: ["a"] },
    { new: true }
  );
  
  console.log("Returned:", res.bio);
  process.exit();
}
check();
