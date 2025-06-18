const aiAnalyzeCode = require('../utils/aiFallback');

exports.analyzeCode = async (req, res) => {
  console.log("Received code analysis request");
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required" });
  }

  let time = null, space = null, source = "ai";

  try {
    const aiResult = await aiAnalyzeCode(code);
    console.log("AI Raw Response:", aiResult);
  
    const matches = aiResult.match(/O\([^)]+\)/g);
    if (!matches || matches.length < 2) throw new Error("Invalid AI result format");
  
    [time, space] = matches;
    source = "ai";
  } catch (aiErr) {
    console.error("AI analysis failed:", aiErr.message);
    return res.status(500).json({ error: "AI analysis failed." });
  }
  
  res.json({ timeComplexity: time, spaceComplexity: space, source });
};
