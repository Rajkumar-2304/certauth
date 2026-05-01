const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const speakeasy = require('speakeasy');
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const { sendEmail } = require('../utils/mailer');

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// @POST /api/auth/signup
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, phone, role, institution, rollNo, admissionNo } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered' });

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const user = await User.create({
      name, email, password, phone, role, institution, rollNo, admissionNo,
      otp, otpExpiry: new Date(Date.now() + 10 * 60 * 1000)
    });

    await sendEmail({
      to: email,
      subject: '🔐 Verify Your CertAuth Account',
      html: `<div style="font-family:sans-serif;max-width:500px;margin:auto;padding:30px;background:#0a0a1a;color:#fff;border-radius:12px">
        <h2 style="color:#d4af37">Welcome to CertAuth!</h2>
        <p>Your OTP for email verification:</p>
        <h1 style="color:#d4af37;font-size:48px;letter-spacing:10px">${otp}</h1>
        <p style="color:#aaa">This OTP expires in 10 minutes.</p>
      </div>`
    });

    res.status(201).json({ success: true, message: 'OTP sent to your email', userId: user._id });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/verify-otp
router.post('/verify-otp', async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    if (user.otp !== otp || user.otpExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();
    const token = signToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
    if (!user.isVerified) return res.status(401).json({ success: false, message: 'Please verify your email first' });

    if (user.twoFactorEnabled) {
      return res.json({ success: true, require2FA: true, userId: user._id });
    }

    const token = signToken(user._id);
    res.json({ success: true, token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/verify-2fa
router.post('/verify-2fa', async (req, res) => {
  try {
    const { userId, token } = req.body;
    const user = await User.findById(userId);
    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token
    });
    if (!verified) return res.status(400).json({ success: false, message: 'Invalid 2FA token' });
    const jwtToken = signToken(user._id);
    res.json({ success: true, token: jwtToken, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @GET /api/auth/me
router.get('/me', protect, (req, res) => {
  res.json({ success: true, user: req.user });
});

// @POST /api/auth/setup-2fa
router.post('/setup-2fa', protect, async (req, res) => {
  try {
    const secret = speakeasy.generateSecret({ name: `CertAuth:${req.user.email}` });
    await User.findByIdAndUpdate(req.user._id, { twoFactorSecret: secret.base32 });
    res.json({ success: true, secret: secret.base32, otpauthUrl: secret.otpauth_url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// @POST /api/auth/enable-2fa
router.post('/enable-2fa', protect, async (req, res) => {
  try {
    const { token } = req.body;
    const user = await User.findById(req.user._id);
    const verified = speakeasy.totp.verify({ secret: user.twoFactorSecret, encoding: 'base32', token });
    if (!verified) return res.status(400).json({ success: false, message: 'Invalid token' });
    await User.findByIdAndUpdate(req.user._id, { twoFactorEnabled: true });
    res.json({ success: true, message: '2FA enabled successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
