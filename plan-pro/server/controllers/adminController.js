//controllers/adminController.js

const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// Middleware to check if user is an administrator
const isAdmin = async (req, res, next) => {
  const token = req.headers.authorization.split(' ')[1];

  try {
    const decodedToken = jwt.verify(token, 'your_secret_key');
    const userId = decodedToken.userId;
    const user = await User.findById(userId);

    if (!user || !user.isAdmin) {
      return res.status(403).json({ error: 'Access forbidden' });
    }

    next();
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
};

const deleteUser = async (req, res) => {
  const userIdToDelete = req.params.userId;

  try {
    const deletedUser = await User.findOneAndDelete({ _id: userIdToDelete });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
};

module.exports = {
  isAdmin,
  getAllUsers,
  deleteUser,
};
