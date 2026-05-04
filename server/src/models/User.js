const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  firebaseUid:     { type: String, required: true, unique: true },
  email:           { type: String, required: true, unique: true },
  fullName:        { type: String, required: true },
  role:            { type: String, enum: ['user', 'admin'], default: 'user' },
  avatar:          { type: String, default: '' },
  phone:           { type: String, default: '' },
  department:      { type: String, default: '' },
  bio:             { type: String, default: '' },
  skills:          [{ type: String }],
  profileComplete: { type: Number, default: 0 },
  isVerified:      { type: Boolean, default: false },
  lastActive:      { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
