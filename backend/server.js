require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/dbConn');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middleware/credentials');
const errorHandler = require('./middleware/errorHandler');
const verifyAccount = require('./middleware/verifyAccount');

const app = express();
const PORT = process.env.PORT || 3500;

connectDB().catch(() => {
  process.exit(1);
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(credentials);
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

// Public routes.
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});
app.use('/guest', require('./routes/guest'));
app.use('/auth', require('./routes/auth'));
app.use('/products', require('./routes/api/products'));

// Everything below requires either a persistent user login or a guest session.
app.use(verifyAccount);
app.use('/cart', require('./routes/api/cart'));
app.use('/orders', require('./routes/api/orders'));

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Connected to MongoDB');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB error:', err);
});
