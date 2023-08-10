//Config/db.js

const mongoose = require('mongoose');

// Connect to the MongoDB database
const dbPromise = mongoose
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

  module.exports = dbPromise;
