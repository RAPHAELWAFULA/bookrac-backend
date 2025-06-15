const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const authRoutes = require('./routes/authRoutes');
const userAction = require('./routes/userActions'); // ✅ NEW

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', authRoutes); // Auth routes (signup/signin)
app.use('/user', userAction); // ✅ New routes for like, favourite, remove

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch((err) => console.log(err));
