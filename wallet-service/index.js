const express = require('express');
const mongoose = require('mongoose');
const Wallet = require('./Models/Wallet');
const axios = require('axios');

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

  
// Create a new wallet for a user

app.post('/wallets', async (req, res) => {
  const { userId } = req.body;

  // Verify user exists in user service
  try {
    const userResponse = await axios.get(`http://user-service:3001/users/${userId}`);
    if (userResponse.status !== 200) {
      return res.status(400).send({ message: 'User does not exist' });
    }
  } catch (error) {
    return res.status(400).send({ message: 'User does not exist or user service not reachable' });
  }

  // Create wallet if user exists
  const wallet = new Wallet(req.body);
  await wallet.save();
  res.send(wallet);
});



// Get wallet by userId
app.get('/wallets/:userId', async (req, res) => {
  const wallet = await Wallet.findOne({ userId: req.params.userId });
  if (!wallet) {
    return res.status(404).send({ message: 'Wallet not found' });
  }
  res.send(wallet);
});

// Update wallet balance (add amount) Add balance to wallet
app.put('/wallets/:userId/balance/deposit', async (req, res) => {
  const { amount } = req.body;
  const wallet = await Wallet.findOne({ userId: req.params.userId });
  if (!wallet) {
    return res.status(404).send({ message: 'Wallet not found' });
  }
  wallet.balance += amount;
  await wallet.save();
  res.send(wallet);
});


// Deduct balance from wallet
app.put('/wallets/:userId/balance/withdraw', async (req, res) => {
  const { amount } = req.body;
  const wallet = await Wallet.findOne({ userId: req.params.userId });
  if (!wallet) {
    return res.status(404).send({ message: 'Wallet not found' });
  }
  if (wallet.balance < amount) {
    return res.status(400).send({ message: 'Insufficient balance' });
  }
  wallet.balance -= amount;
  await wallet.save();
  res.send(wallet);
});

app.listen(3002, () => {
  console.log('Wallet service running on port 3002');
});
