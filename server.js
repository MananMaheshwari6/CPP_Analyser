const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const complexityRoutes = require('./backend/routes/complexityRoutes');
const cors = require('cors');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Mock in-memory database for testing
const inMemoryDb = {
  codeHistory: []
};

// Try connecting to MongoDB, but continue if it fails
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => {
  console.log("MongoDB connection failed:", err.message);
  console.log("Using in-memory database for testing instead");
});

app.use('/api/complexity', complexityRoutes);

// Add route to check if the server is running
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
