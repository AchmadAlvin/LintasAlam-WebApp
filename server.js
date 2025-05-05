require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const { errorHandler } = require("./middleware/errorHandler");
const mqttService = require("./services/mqttService");

const app = express();

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(compression()); // Compress responses
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(morgan("dev")); // Logging

// Serve static files from public directory
app.use(express.static("public"));

// API Routes
app.use("/api/messages", require("./api/get-messages"));
app.use("/api/save-message", require("./api/save-message"));

// Error handling middleware
app.use(errorHandler);

// Connect to MQTT broker
mqttService.connect();

// Handle process termination
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  mqttService.disconnect();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully...");
  mqttService.disconnect();
  process.exit(0);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});
