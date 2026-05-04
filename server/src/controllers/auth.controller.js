const User = require('../models/User');
const OTP = require('../models/OTP');
const bcrypt = require('bcryptjs');
const emailService = require('../services/emailService');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    const { firebaseUid, email, fullName } = req.body;
    if (!firebaseUid) return res.status(400).json({ error: 'firebaseUid is required' });
    let user = await User.findOne({ firebaseUid });
    if (!user) {
      user = new User({ firebaseUid, email, fullName });
      await user.save();
    }
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { firebaseUid, email } = req.body;
    let user = await User.findOne({ firebaseUid });
    
    if (!user) {
      if (!email) return res.status(400).json({ error: 'User not found. Please register.' });
      user = new User({ firebaseUid, email, fullName: email.split('@')[0] });
      await user.save();
    }
    res.json({ message: 'Login successful', role: user.role, _id: user._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(otpCode, 10);
    
    await OTP.create({
      email,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000)
    });

    await emailService.sendOtpEmail(email, otpCode);
    res.json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const otpRecord = await OTP.findOne({ email, used: false }).sort({ createdAt: -1 });
    if (!otpRecord || otpRecord.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const isValid = await bcrypt.compare(otp, otpRecord.otp);
    if (!isValid) return res.status(400).json({ error: 'Invalid OTP' });

    otpRecord.used = true;
    await otpRecord.save();

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '15m' });
    res.json({ message: 'OTP verified', resetToken });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  // Mock Firebase Admin SDK reset for now
  try {
    const { resetToken, newPassword } = req.body;
    const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'secret');
    res.json({ message: `Password reset successful for ${decoded.email}.` });
  } catch (err) {
    res.status(400).json({ error: 'Invalid or expired reset token' });
  }
};
