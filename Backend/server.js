const express = require('express');
const dotenv = require('dotenv');
const routes = require('./routes/index');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');
const connectDB = require('./confiq/db');

import healthRoutes from "./routes/healthRoutes";
import { Client } from "@gradio/client";

dotenv.config();
connectDB();

const app = express();

// Dynamic CORS Origin Handling
const allowedOrigins = ['http://127.0.0.1:5500', 'http://localhost:5500'];
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-CSRF-Token'],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

// Middleware setup
app.use(express.json()); // To parse JSON request bodies

// Default route
app.get('/', (req, res) => {
  res.send('AI Chatbot Backend is running...');
});

// API routes
app.use('/api/v1', routes);

// Attach Hugging Face client globally
let client;
(async () => {
  client = await Client.connect("Agents-MCP-Hackathon/healthcare-mcp-public");
  app.locals.gradioClient = client; // make available in controllers
})();

// Routes
app.use("/api/health", healthRoutes);


// Error handler middleware (should be after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});