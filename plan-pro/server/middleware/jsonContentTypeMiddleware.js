//middleware/jsonContentTypeMiddleware.js

// Middleware to check if the request content type is JSON
const jsonContentTypeMiddleware = (req, res, next) => {
  if (req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'Content type must be application/json' });
  }
  next();
};

module.exports = jsonContentTypeMiddleware;