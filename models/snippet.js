const mongoose = require('mongoose');

const SnippetSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  language: { type: String, required: true },
  tags: { type: [String], default: [] },
  description: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Snippet', SnippetSchema);
