const axios = require("axios");

exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    console.log("Using API:", process.env.AI_API_URL);
    console.log("Key Loaded:", !!process.env.AI_API_KEY);

    const response = await axios.post(
      process.env.AI_API_URL,
      {
        model: groq("llama-3.3-70b-versatile"),
        messages: [
          { role: "user", content: message }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.choices[0].message.content;

    res.json({ reply });

  } catch (error) {
    console.error("AI ERROR:", error.response?.data || error.message);

    res.status(500).json({
      message: "AI request failed",
      error: error.response?.data || error.message
    });
  }
};
