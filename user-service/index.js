const express = require('express');
const mongoose = require('mongoose');
const User = require('./Models/User');

const app = express();
app.use(express.json());

// Connect to MongoDB
const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/fintechdb';

mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Create user
app.post('/users', async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.send(user);
});

// Get all users
app.get('/users', async (req, res) => {
  const users = await User.find();
  res.send(users);
});


// Get user by ID
app.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send({ message: 'User not found' });
    res.send(user);
  } catch {
    res.status(400).send({ message: 'Invalid user id' });
  }
});

app.listen(3001, () => {
  console.log('User service running on port 3001');
});
