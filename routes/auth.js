const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Snippet = require('../models/snippet');
const jwt = require('jsonwebtoken');

const authMiddleware = require('../middleware/auth'); // Assuming you have an auth middleware

const generateToken = (user) => {
  // This function would generate a JWT token for the user
  //create a jwt
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return token;
};

// Example route to test user creation
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully ✅' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example route to fetch all users
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Example route to handle user login
router.post('/login', async (req, res) => {
  try {
    const { email, rememberMe, password } = req.body;
    const user = await User.find({ email, password });
    if (user.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    if (rememberMe) {
      // If rememberMe is true, set a longer expiration time for the cookie
      res.cookie('token', generateToken(user[0]), { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true, secure: false, sameSite: 'strict' });
    } else {
      // If rememberMe is false, set a shorter expiration time for the cookie
      res.cookie('token', generateToken(user[0]), { maxAge: 60 * 60 * 1000, httpOnly: true, secure: false, sameSite: 'strict' });
    }
    return res.status(200).json({ message: 'Login successful.', user: user[0] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/dashboard-data', authMiddleware, async (req, res) => {
  try {
    // Fetch some dashboard data, e.g., username
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    //fetch user snippets
    const snippets = await Snippet.find({ userId: user._id }).populate('userId', 'username email');
    return res.status(200).json({ username: user.username, email: user.email, snippets: snippets });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  try {
    // Clear the cookie by setting its maxAge to 0
    res.cookie('token', '', { maxAge: 0, httpOnly: true, secure: false, sameSite: 'strict' });
    return res.status(200).json({ message: 'Logout successful.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});


module.exports = router;