//models/User.js
const mongoose = require('mongoose');

// Define a MongoDB schema for User collection
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

// Create a MongoDB model based on the UserSchema
const User = mongoose.model('User', UserSchema);

module.exports=User;
