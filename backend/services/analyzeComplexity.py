import re
import sys

class Complexity:
    #heuristic rules
    CONSTANT = "O(1)"
    LINEAR = "O(n)"
    QUADRATIC = "O(n^2)"
    CUBIC = "O(n^3)"
    LINEARITHMIC = "O(n log n)"
    EXPONENTIAL = "O(2^n)"
    UNKNOWN = "Unknown"

class CodeLineAnalysis:
    def __init__(self, line_number, code, complexity, reason):
        self.line_number = line_number
        self.code = code
        self.complexity = complexity
        self.reason = reason

class ComplexityAnalyzer:
    def __init__(self, code_lines):
        self.code_lines = code_lines
        self.results = []
        self.function_defs = {}
        self.current_function = ""
        self.nesting_level = 0
        self.max_nesting = 0
        self.block_stack = []

    def trim(self, line):
        return line.strip()

    def is_comment(self, line):
        return not line or line.strip().startswith("//")

    def is_recursive(self, line):
        if not self.current_function:
            return False
        return re.search(rf"\b{re.escape(self.current_function)}\s*\(", line)

    def track_function_definitions(self):
        for line in self.code_lines:
            match = re.search(r"\b(?:int|void|float|double|bool|auto)\s+(\w+)\s*\([^)]*\)\s*(const)?\s*[{;]", line)
            if match:
                func_name = match.group(1)
                self.function_defs[func_name] = True

    def analyze_line(self, line):
        if self.is_comment(line):
            return Complexity.CONSTANT, "Comment or blank line"

        if re.search(r"\b(for|while)\s*\(", line):
            if self.nesting_level == 0:
                return Complexity.LINEAR, "Single loop"
            elif self.nesting_level == 1:
                return Complexity.QUADRATIC, "Nested loop"
            elif self.nesting_level == 2:
                return Complexity.CUBIC, "Triple nested loop"
            else:
                return Complexity.EXPONENTIAL, "Deep nested loops"

        if self.is_recursive(line):
            return Complexity.EXPONENTIAL, "Recursive call"

        if re.search(r"\b[a-zA-Z_][a-zA-Z0-9_]*\s*\([^)]*\)\s*;", line):
            return Complexity.UNKNOWN, "Function call"

        return Complexity.CONSTANT, "Basic operation"

    def analyze(self):
        self.track_function_definitions()

        for i, raw_line in enumerate(self.code_lines):
            line = self.trim(raw_line)

            func_match = re.search(r"\b([a-zA-Z_][a-zA-Z0-9_]*)\s*\([^)]*\)\s*(const)?\s*[{]", line)
            if func_match:
                self.current_function = func_match.group(1)

            if "for" in line or "while" in line:
                self.block_stack.append("loop")
                self.nesting_level += 1
                self.max_nesting = max(self.max_nesting, self.nesting_level)
            elif "{" in line:
                self.block_stack.append("block")

            comp, reason = self.analyze_line(line)
            self.results.append(CodeLineAnalysis(i + 1, line, comp, reason))

            if "}" in line and self.block_stack:
                if self.block_stack[-1] == "loop":
                    self.nesting_level -= 1
                self.block_stack.pop()

        return self.results

    def estimate_overall_complexity(self):
        if self.max_nesting == 0:
            return Complexity.CONSTANT
        elif self.max_nesting == 1:
            return Complexity.LINEAR
        elif self.max_nesting == 2:
            return Complexity.QUADRATIC
        elif self.max_nesting == 3:
            return Complexity.CUBIC
        else:
            return Complexity.EXPONENTIAL

def analyze_cpp_code(code):
    lines = code.splitlines()
    analyzer = ComplexityAnalyzer(lines)
    analyzer.analyze()
    return analyzer.estimate_overall_complexity(), "O(1)"  # Simplified space for now

if __name__ == "__main__":
    try:
        filename = sys.argv[1]
        with open(filename, "r") as f:
            code = f.read()
        time_cx, space_cx = analyze_cpp_code(code)
        print(f"{time_cx},{space_cx}")
    except Exception as e:
        print("ERROR:", e)
        sys.exit(1)
