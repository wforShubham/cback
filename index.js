require("dotenv").config();
const connectToMongo = require("./db");
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require('./models/User');
const fetch = require("node-fetch");
const cn = require("./middleware/cn");

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


router.post("/analyze-complexity", cn, async (req, res) => {
  try {
    const { code } = req.body;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.0-pro-exp-02-05:free",
        messages: [
          {
            role: "user",
            content: `Analyze the following code and provide only time complexity and space complexity in format: 
                      Space Complexity: (value)
                      Time Complexity: (value)\n\n${code}`,
          },
        ],
      }),
    });

    const data = await response.json();
    console.log(data)
    res.json({ complexity: data.choices[0]?.message?.content || "Analysis failed" });
  } catch (error) {
    console.error("Error analyzing complexity:", error);
    res.status(500).json({ error: "Failed to analyze complexity" });
  }
});

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
