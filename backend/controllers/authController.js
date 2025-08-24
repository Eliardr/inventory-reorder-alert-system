// backend/controllers/authController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');           // matches your package.json
const User = require('../models/User');

// helpers
function signToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
function toPublicUser(user) {
  if (!user) return null;
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    university: user.university || '',
    address: user.address || '',
  };
}

// POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const nameRaw   = (req.body?.name || '').trim();
    const emailRaw  = (req.body?.email || '').trim();
    const password  = String(req.body?.password || '');

    if (!nameRaw || !emailRaw || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    // normalize email before lookup & save
    const email = emailRaw.toLowerCase();

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const user = await User.create({ name: nameRaw, email, password: hash });

    const token = signToken(user._id);
    res.set('Authorization', `Bearer ${token}`);

    return res.status(201).json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('Register error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const emailRaw = (req.body?.email || '').trim();
    const password = String(req.body?.password || '');
    if (!emailRaw || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // normalize for lookup
    const email = emailRaw.toLowerCase();

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    res.set('Authorization', `Bearer ${token}`);

    return res.json({ token, user: toPublicUser(user) });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.json({ user: toPublicUser(user) });
  } catch (err) {
    console.error('getMe error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PUT /api/auth/me
exports.updateMe = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const { name, university, address } = req.body ?? {};
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name !== undefined) user.name = name;
    if (university !== undefined) user.university = university;
    if (address !== undefined) user.address = address;

    const saved = await user.save();
    return res.json({ user: toPublicUser(saved) });
  } catch (err) {
    console.error('updateMe error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};
