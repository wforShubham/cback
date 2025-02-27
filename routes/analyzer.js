require("dotenv").config();
const express = require("express");
const fetch = require("node-fetch");
const cn = require("../middleware/cn");

const router = express.Router();

router.post("/analyze-complexity", cn, async (req, res) => {
  console.log("pohoch gaya")
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

// ✅ Correct CommonJS export
module.exports = router;
