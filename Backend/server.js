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

// Use CORS middleware BEFORE routes
app.use(cors({
  origin: "http://127.0.0.1:5500", // or your actual frontend port
  credentials: true,
}));

app.options('*', cors()); // handle preflight

// Default route
app.get('/', (req, res) => {
  res.send('AI Chatbot Backend is running...');
});

// API routes
app.use('/api/v1', routes);

// Error handler middleware (usually last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
