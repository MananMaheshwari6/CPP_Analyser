const CodeHistory = require('../models/CodeHistory');
const runPython = require('../utils/runPython');

exports.analyzeCode = async (req, res) => {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: "Code is required" });

    try {
        const output = await runPython(code);
        const [time, space] = output.trim().split(',');

        const entry = new CodeHistory({ code, timeComplexity: time, spaceComplexity: space });
        await entry.save();

        res.json({ timeComplexity: time, spaceComplexity: space });
    } catch (err) {
        res.status(500).json({ error: "Failed to analyze code", details: err.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const history = await CodeHistory.find().sort({ createdAt: -1 });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch history" });
    }
};
