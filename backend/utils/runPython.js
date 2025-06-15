const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

module.exports = async function runPython(code) {
    console.log("🔧 Starting Python script execution...");

    const scriptPath = path.resolve(__dirname, "../services/analyzeComplexity.py");
    const tempFile = path.resolve(__dirname, "temp.cpp");

    console.log("📄 Python script path:", scriptPath);
    console.log("🧪 Code preview:", code.substring(0, 200) + (code.length > 200 ? "..." : ""));
    console.log("📁 Current directory:", process.cwd());

    try {
        // Write code to temp file
        await fs.writeFile(tempFile, code);
        console.log("✅ Temp C++ file created at:", tempFile);

        // Run the Python script with a timeout
        const python = spawn('C:\\Python312\\python.exe', [scriptPath, tempFile], {
            stdio: ['pipe', 'pipe', 'pipe'],
            cwd: path.dirname(scriptPath)  // Set working directory to script location
        });

        let output = '';
        let errorOutput = '';
        let timeoutId;

        // Set up timeout
        const timeout = 10000; // 10 seconds
        timeoutId = setTimeout(() => {
            if (python) {
                console.error("❌ Python script timed out after", timeout, "ms");
                python.kill('SIGTERM');
            }
        }, timeout);

        // Handle process output
        python.stdout.on("data", (data) => {
            const dataStr = data.toString();
            output += dataStr;
            console.log("🐍 Python stdout:", dataStr);
        });

        python.stderr.on("data", (data) => {
            const dataStr = data.toString();
            errorOutput += dataStr;
            console.error("🐍 Python stderr:", dataStr);
        });

        // Handle process completion
        await new Promise((resolve, reject) => {
            python.on('error', (err) => {
                console.error("❌ Python process error:", err);
                reject(err);
            });

            python.on('close', (code) => {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                
                console.log("🐍 Python process exited with code:", code);
                if (code !== 0 || errorOutput) {
                    console.error("❌ Python script error:", errorOutput);
                    reject(new Error(`Python script failed with code ${code}: ${errorOutput}`));
                } else {
                    console.log("✅ Python script output:", output.trim());
                    resolve(output.trim());
                }
            });
        });

        return output.trim();

    } catch (error) {
        console.error("🚨 Error running Python script:", error.message);
        throw new Error(`Failed to run Python script: ${error.message}`);

    } finally {
        // Cleanup
        try {
            await fs.unlink(tempFile);
            console.log("🗑️ Temp file deleted:", tempFile);
        } catch (err) {
            console.warn("⚠️ Failed to delete temp file:", err.message);
        }
    }
};
