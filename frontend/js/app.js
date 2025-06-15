// frontend/js/app.js
document.addEventListener("DOMContentLoaded", () => {
  /* ────────── CodeMirror ────────── */
  const codeEditor = CodeMirror(document.getElementById("code-editor"), {
    mode: "text/x-c++src",
    theme: "dracula",
    lineNumbers: true,
    indentUnit: 4,
    autoCloseBrackets: true,
    matchBrackets: true,
    lineWrapping: true,
    value: `// Enter your C++ code here
#include <iostream>

int main() {
    std::cout << "Hello World!";
    return 0;
}`
  });

  /* ────────── DOM refs ────────── */
  const fileInput        = document.getElementById("file-input");
  const fileNameSpan     = document.getElementById("file-name");
  const analyzeBtn       = document.getElementById("analyze-btn");
  const loadingIndicator = document.getElementById("loading-indicator");
  const timeOutEl        = document.getElementById("time-complexity");
  const spaceOutEl       = document.getElementById("space-complexity");
  const themeToggle      = document.getElementById("theme-toggle-input");
  const analyzeNewBtn    = document.getElementById("analyze-new-btn");
  const analyzerPage     = document.getElementById("analyzer-page");
  const dashboardPage    = document.getElementById("dashboard-page");

  /* ────────── File upload → editor ────────── */
  fileInput.addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    fileNameSpan.textContent = file.name;
    const reader = new FileReader();
    reader.onload = ev => codeEditor.setValue(ev.target.result);
    reader.readAsText(file);
  });

  /* ────────── Theme toggle ────────── */
  themeToggle.addEventListener("change", () => {
    const light = themeToggle.checked;            // checked = light
    document.body.classList.toggle("light-mode", light);
    codeEditor.setOption("theme", light ? "default" : "dracula");
  });

  /* ────────── Analyze button ────────── */
  analyzeBtn.addEventListener("click", () => {
    const code = codeEditor.getValue().trim();
    if (!code) {
      alert("Please enter or upload C++ code to analyze.");
      return;
    }

    // UI state
    analyzeBtn.disabled = true;
    analyzeBtn.textContent = "Analyzing…";
    loadingIndicator.classList.remove("hidden");
    timeOutEl.textContent = spaceOutEl.textContent = "-";

    fetch("/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ code })
    })
      .then(res => res.ok ? res.json() : Promise.reject(res.statusText))
      .then(({ timeComplexity, spaceComplexity }) => {
        timeOutEl.textContent  = timeComplexity;
        spaceOutEl.textContent = spaceComplexity;
        setComplexityColor(timeOutEl,  timeComplexity);
        setComplexityColor(spaceOutEl, spaceComplexity);
      })
      .catch(err => {
        console.error(err);
        alert("Failed to analyze code. Please try again.");
      })
      .finally(() => {
        analyzeBtn.disabled = false;
        analyzeBtn.textContent = "Analyze Complexity";
        loadingIndicator.classList.add("hidden");
      });
  });

  /* ────────── Go back to analyzer page ────────── */
  analyzeNewBtn?.addEventListener("click", () => {
    dashboardPage.classList.add("hidden");
    analyzerPage.classList.remove("hidden");
  });

  /* ────────── Helpers ────────── */
  function setComplexityColor(el, c) {
    if (["O(1)", "O(log n)"].includes(c))      el.style.color = "#10b981"; // green
    else if (["O(n)", "O(n log n)"].includes(c)) el.style.color = "#f59e0b"; // yellow
    else                                         el.style.color = "#ef4444"; // red
  }

  /* Keep CodeMirror sized */
  window.addEventListener("resize", () => codeEditor.refresh());
});
