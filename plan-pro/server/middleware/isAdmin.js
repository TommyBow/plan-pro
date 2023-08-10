//middleware/isAdmin.js

const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

module.exports = isAdmin;
