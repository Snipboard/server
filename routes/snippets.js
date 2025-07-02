const express = require('express');
const router = express.Router();

const User = require('../models/user');
const Snippet = require('../models/snippet');

const authMiddleware = require('../middleware/auth'); // Assuming you have an auth middleware


router.get('/', async (req, res) => {
  try {
    const snippets = await Snippet.find().populate('userId', 'username email');
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const snippets = await Snippet.find({ userId }).populate('userId', 'username email');
    res.json(snippets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/create', authMiddleware, async (req, res) => {
    try {
        const { title, content, language, description } = req.body;
        const userId = req.userId; // Assuming userId is set by auth middleware
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        
        const newSnippet = new Snippet({ title, content, language, description, userId });
        await newSnippet.save();
        
        res.status(201).json({ message: 'Snippet created successfully', snippet: newSnippet });
    } catch (err) {
        res.status(500).json({ message: 'Error creating snippet', error: err.message });
    }
});

module.exports = router;