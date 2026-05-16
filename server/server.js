const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/auth', require('./routes/auth'));
// app.use('/api/goals', require('./routes/goals'));
// app.use('/api/reports', require('./routes/reports'));

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', service: 'AtomQuest API', timestamp: new Date() });
});

// Basic Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
