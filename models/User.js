const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  bio: { type: String, default: 'StreamNet Creator' },
  avatarColor: { type: String, default: '#a855f7' }
});

module.exports = mongoose.model('User', UserSchema);