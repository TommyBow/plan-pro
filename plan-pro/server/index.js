const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;

// Create an instance of Express application
const app = express();

// Specify the port number for the server to listen on
const port = 5000;

// Middleware to enable Cross-Origin Resource Sharing
app.use(cors());

// Middleware to parse incoming JSON data
app.use(bodyParser.json());

// Connect to the MongoDB database
mongoose
  .connect('mongodb+srv://thomascane9:445D8fxBpba5i2I7@to-dolist.lhq8lde.mongodb.net/?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Define a MongoDB schema for User collection
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
});

// Create a MongoDB model based on the UserSchema
const User = mongoose.model('User', UserSchema);

// Define a MongoDB schema for Task collection
const Task = mongoose.model('Task', {
  title: String,
  description: String,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// Middleware to check the maximum length of the task title
const maxTaskTitleLengthMiddleware = (req, res, next) => {
  const { title } = req.body;
  if (title && title.length > 100) {
    return res.status(400).json({ error: 'Task title is too long' });
  }
  next();
};

// Middleware to check if the request content type is JSON
const jsonContentTypeMiddleware = (req, res, next) => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'Content type must be application/json' });
  }
  next();
};

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

// Passport configuration for Google authentication
passport.use(new GoogleStrategy({
  clientID: 'your_google_client_id',
  clientSecret: 'your_google_client_secret',
  callbackURL: 'http://localhost:5000/api/auth/google/callback',
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ username: profile.emails[0].value });
      if (!user) {
        user = new User({
          username: profile.emails[0].value,
          password: '',
        });
        await user.save();
      }
      const token = jwt.sign({ userId: user._id, username: user.username }, 'your_secret_key', {
        expiresIn: '1h',
      });
      return done(null, token);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Passport configuration for Facebook authentication
passport.use(new FacebookStrategy({
  clientID: 'your_facebook_app_id',
  clientSecret: 'your_facebook_app_secret',
  callbackURL: 'http://localhost:5000/api/auth/facebook/callback',
  profileFields: ['id', 'emails'],
},
  async (accessToken, refreshToken, profile, done) => {
    try {
      let user = await User.findOne({ username: profile.emails[0].value });
      if (!user) {
        user = new User({
          username: profile.emails[0].value,
          password: '',
        });
        await user.save();
      }
      const token = jwt.sign({ userId: user._id, username: user.username }, 'your_secret_key', {
        expiresIn: '1h',
      });
      return done(null, token);
    } catch (error) {
      return done(error, null);
    }
  }
));

// API endpoint for user registration
app.post('/api/register', async (req, res) => {
  const { username, password, isAdmin } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword, isAdmin });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// API endpoint for user login
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, username: user.username }, 'your_secret_key', {
      expiresIn: '1h',
    });
    res.json({ token, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});


// API endpoint for adding a new task
app.post('/api/tasks', maxTaskTitleLengthMiddleware, async (req, res) => {
  const { title, description } = req.body;
  try {
    // Extract the user ID from the JWT token for authentication
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'your_secret_key');
    const userId = decodedToken.userId;
    // Create a new Task instance and associate it with the user ID
    const task = new Task({ title, description, userId });
    await task.save();
    res.status(201).json({ message: 'Task added successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add task' });
  }
});

// API endpoint for fetching tasks for a specific user
app.get('/api/tasks', async (req, res) => {
  try {
    // Extract the user ID from the JWT token for authentication
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'your_secret_key');
    const userId = decodedToken.userId;
    // Find all tasks associated with the user ID in the database
    const tasks = await Task.find({ userId });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// API endpoint for editing a task
app.put('/api/tasks/:taskId', maxTaskTitleLengthMiddleware, async (req, res) => {
  const { title, description } = req.body;
  const taskId = req.params.taskId;
  try {
    // Extract the user ID from the JWT token for authentication
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'your_secret_key');
    const userId = decodedToken.userId;

    // Check if the task belongs to the authenticated user
    const task = await Task.findOneAndUpdate({ _id: taskId, userId }, { title, description }, { new: true });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task updated successfully', task });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// API endpoint for deleting a task
app.delete('/api/tasks/:taskId', async (req, res) => {
  const taskId = req.params.taskId;
  try {
    // Extract the user ID from the JWT token for authentication
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'your_secret_key');
    const userId = decodedToken.userId;

    // Check if the task belongs to the authenticated user
    const task = await Task.findOneAndDelete({ _id: taskId, userId });
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

// API endpoint to fetch all users' data for administrators
app.get('/api/admin/users', isAdmin, async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching user data' });
  }
});

// API endpoint to delete a user (only accessible by administrators)
app.delete('/api/admin/users/:userId', isAdmin, async (req, res) => {
  const userId = req.params.userId;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
});

// Initialize passport
app.use(passport.initialize());

// Google authentication route
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Facebook authentication route
app.get('/api/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
