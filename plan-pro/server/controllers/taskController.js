//controllers/taskController.js

const Task = require('../models/Task'); // Import the Task model

const addTask = async (req, res) => {
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
};

const getTasks = async (req, res) => {
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
};

const updateTask = async (req, res) => {
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
};

const deleteTask = async (req, res) => {
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
};

module.exports = {
  addTask,
  getTasks,
  updateTask,
  deleteTask,
};
