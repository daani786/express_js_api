const mongoose = require('mongoose');

// User Schema and Model
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  gender: {
    type: String,
    required: true
  },
  jobTitle: {
    type: String,
    required: true
  }
}, {timestamps: true});

const User = mongoose.model('User', userSchema);

module.exports = User;