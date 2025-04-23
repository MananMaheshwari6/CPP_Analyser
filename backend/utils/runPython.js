const { spawn } = require('child_process');
const path = require('path');

module.exports = function runPython(code) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python3', [path.join(__dirname, '../services/analyzeComplexity.py')]);

        let result = '';
        let error = '';

        pythonProcess.stdout.on('data', data => result += data.toString());
        pythonProcess.stderr.on('data', data => error += data.toString());

        pythonProcess.on('close', codeExit => {
            if (codeExit !== 0 || error) reject(new Error(error));
            else resolve(result);
        });

        pythonProcess.stdin.write(code);
        pythonProcess.stdin.end();
    });
};
