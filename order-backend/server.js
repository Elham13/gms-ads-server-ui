const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const orderRoutes = require('./routes/orderRoutes');
const checkClientRoutes = require('./routes/checkClient');
const upiRoutes = require('./routes/upiRoutes');
const authRoutes = require('./routes/authRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const app = express();
require('dotenv').config();
app.use(cors());
app.use(express.json());

app.use('/api', orderRoutes);
app.use('/api', checkClientRoutes);
app.use('/api/upi-numbers', upiRoutes);
app.use('/api', authRoutes); 
app.use('/api', appointmentRoutes);// Register the authentication routes
// Connect to MongoDB using the URI from .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
