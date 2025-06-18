const aiAnalyzeCode = require('../utils/aiFallback');

exports.analyzeCode = async (req, res) => {
  const { code } = req.body;

  if (!code || typeof code !== "string") {
    return res.status(400).json({ error: "Code is required" });
  }

  try {
    const aiResult = await aiAnalyzeCode(code);
    const result = aiResult.trim();

    // Check if it's an invalid code response
    if (/^Invalid code$/i.test(result)) {
      return res.json({ timeComplexity: "invalid", spaceComplexity: "code", source: "ai", message: "Invalid code" });
    }

    // Extract complexity using regex
    const matches = result.match(/O\([^)]+\)/g);
    if (!matches || matches.length < 2) {
      return res.json({ timeComplexity: null, spaceComplexity: null, source: "ai", message: "Invalid AI result" });
    }

    const [time, space] = matches;
    return res.json({ timeComplexity: time, spaceComplexity: space, source: "ai" });

  } catch (err) {
    console.error("Analysis error:", err.message);
    return res.status(500).json({ error: "AI analysis failed." });
  }
};
