require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require('./models/User');

connectToMongo();
const app = express();
const port = process.env.PORT_BACKEND || 5000;
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Enable CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Allow only frontend port
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
