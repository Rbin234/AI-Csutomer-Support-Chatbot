const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/index');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const connectDB = require('./confiq/db');

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); // To parse JSON request bodies

// Default route
app.get('/', (req, res) => {
  res.send('AI Chatbot Backend is running...');
});

// API routes
app.use('/api/v1', routes);

app.use(cors());

// Error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
