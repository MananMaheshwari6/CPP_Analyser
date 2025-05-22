const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const complexityRoutes = require('./backend/routes/complexityRoutes');

dotenv.config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

app.use('/api/complexity', complexityRoutes);

const PORT = 5001; 
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

//testing