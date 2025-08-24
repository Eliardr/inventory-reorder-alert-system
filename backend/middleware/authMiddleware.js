// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    // accept both 'authorization' and 'Authorization'
    const header = req.headers.authorization || req.headers.Authorization || '';
    let token = null;

    if (header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    } else if (req.query && req.query.token) {
      token = req.query.token; // optional fallback for tests
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      // IMPORTANT: stop here if the token refers to a user that doesn't exist
      return res.status(401).json({ message: 'Not authorized: user not found' });
    }

    req.user = user; // <-- guaranteed non-null beyond this point
    return next();
  } catch (err) {
    console.error('protect error:', err.message);
    return res.status(401).json({ message: 'Not authorized' });
  }
};

module.exports = { protect };
