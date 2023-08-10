//middleware/maxTasTitleLengthMiddleware.js

// Middleware to check the maximum length of the task title
const maxTaskTitleLengthMiddleware = (req, res, next) => {
  const { title } = req.body;
  if (title && title.length > 100) {
    return res.status(400).json({ error: 'Task title is too long' });
  }
  next();
};

module.exports = maxTaskTitleLengthMiddleware;