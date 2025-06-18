const axios = require("axios");

module.exports = async function aiAnalyzeCode(code) {
  const prompt = `You are an expert C++ code analyzer. Analyze the following code and respond strictly in this format: O(time complexity),O(space complexity). Do not include explanations.

  ${code}`;

  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: process.env.OPENROUTER_MODEL,
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": process.env.OPENROUTER_SITE_URL,
          "X-Title": process.env.OPENROUTER_SITE_NAME,
          "Content-Type": "application/json"
        }
      }
    );

    const result = response.data.choices[0].message.content.trim();
    return result;
  } catch (error) {
    console.error("🧠 OpenRouter API error:", error.response?.data || error.message);
    throw new Error("AI analysis failed");
  }
};
