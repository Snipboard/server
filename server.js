require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

const cookieParser = require('cookie-parser');
app.use(cookieParser());


app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useUnifiedTopology: true });
// Define routes and middleware
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const snippetRoutes = require('./routes/snippets');
app.use('/api/snippets', snippetRoutes);