const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('./config/passport'); // Import passport configuration
const db = require('./config/db'); // Import database configuration
const authController = require('./controllers/authController');
const taskController = require('./controllers/taskController');
const adminController = require('./controllers/adminController'); // Import adminController
const jwtAdminMiddleware = require('./middleware/isAdmin');
const jsonContentTypeMiddleware = require('./middleware/jsonContentTypeMiddleware');
const maxTaskTitleLengthMiddleware = require('./middleware/maxTaskTitleLengthMiddleware');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

// Initialize passport
app.use(passport.initialize());

// User authentication routes
app.post('/api/register', authController.registerUser);
app.post('/api/login', authController.loginUser);

// Task management routes
app.post('/api/tasks', [jsonContentTypeMiddleware, maxTaskTitleLengthMiddleware], taskController.addTask);
app.get('/api/tasks', taskController.getTasks);
app.put('/api/tasks/:taskId', [jsonContentTypeMiddleware, maxTaskTitleLengthMiddleware], taskController.updateTask);
app.delete('/api/tasks/:taskId', taskController.deleteTask);

// Admin routes
app.get('/api/admin/users', [jwtAdminMiddleware], adminController.getAllUsers);
app.delete('/api/admin/users/:userId', [jwtAdminMiddleware], adminController.deleteUser);

// Google authentication callback
app.get('/api/auth/google/callback', passport.authenticate('google', { session: false }), (req, res) => {
  // Handle successful Google authentication callback here
  res.json({ message: 'Google authentication successful' });
});

// Facebook authentication callback
app.get('/api/auth/facebook/callback', passport.authenticate('facebook', { session: false }), (req, res) => {
  // Handle successful Facebook authentication callback here
  res.json({ message: 'Facebook authentication successful' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
