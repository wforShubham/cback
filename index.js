require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require('./models/User');

const router = express.Router();

connectToMongo();
const app = express();
const port = process.env.PORT_BACKEND || 5000;

// Enable CORS
app.use(
  cors({
    origin: "https://codenote-j0f7.onrender.com", // Allow only frontend port
    credentials: true, // If handling cookies or tokens
  })
);

// Middleware to parse JSON
app.use(express.json());


// Available Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));
app.use("/api/contact", require("./routes/contact"));
app.use("/api/compiler", require("./routes/compiler"));
app.use("/api/", require("./routes/forget-password"));
app.use("/api/", require("./routes/reset-password"));
app.use("/api/", require("./routes/user-role"));
app.use("/api/", require("./routes/analyzer"));


// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send({ error: "Route not found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ error: "Something went wrong!" });
});

// Start the server
app.listen(port, () => {
  console.log(`Code Note backend listening at http://localhost:${port}`);
});
