// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name:   { type: String, required: true, trim: true },
    email:  { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },

    // optional fields used by your Profile page
    university: { type: String, trim: true, default: '' },
    address:    { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
