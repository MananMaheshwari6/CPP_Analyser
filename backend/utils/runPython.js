const { spawn } = require("child_process");
const path = require("path");

module.exports = function runPython(code) {
    return new Promise((resolve, reject) => {
        const scriptPath = path.join(__dirname, "analyzeComplexity.py");

        const python = spawn("python", [scriptPath]);

        let result = "";
        let errorOutput = "";

        python.stdout.on("data", (data) => {
            result += data.toString();
        });

        python.stderr.on("data", (data) => {
            errorOutput += data.toString();
        });

        python.on("close", (code) => {
            if (code !== 0 || errorOutput) {
                console.error("Python error:", errorOutput);
                reject(`Python script failed with code ${code}\n${errorOutput}`);
            } else {
                resolve(result.trim()); // e.g., "O(n log n),O(n)"
            }
        });

        // Send the C++ code to the Python script
        python.stdin.write(code);
        python.stdin.end();
    });
};
