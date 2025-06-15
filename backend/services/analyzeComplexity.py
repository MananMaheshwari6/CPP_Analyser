import sys
import subprocess
import tempfile
import os
import traceback

def analyze_cpp_code(code):
    """
    Analyze C++ code by creating a temp file and using Clang to dump the AST.
    Returns a placeholder time complexity string or error message.
    """
    temp_path = None

    try:
        print(f"\n=== Starting analysis ===")
        print(f"Code length: {len(code)} characters")
        print(f"First 100 chars: {code[:100]}")
        
        # Create a temporary file with the code
        with tempfile.NamedTemporaryFile(mode='w+', suffix='.cpp', delete=False) as temp:
            temp.write(code)
            temp.flush()
            temp_path = temp.name
            print(f"\n=== Created temp file ===")
            print(f"Temp file path: {temp_path}")
            print(f"File content preview:\n{code[:100]}...")

        # Verify file exists and has content
        if not os.path.exists(temp_path):
            print(f"=== ERROR ===")
            print(f"Temp file {temp_path} does not exist!")
            return "ERROR: Failed to create temp file"

        with open(temp_path, 'r') as f:
            content = f.read()
            if not content:
                print("=== ERROR ===")
                print("Temp file is empty!")
                return "ERROR: Empty temp file"

        # Run Clang AST dump
        try:
            print("\n=== Starting Clang analysis ===")
            print(f"Running: clang -Xclang -ast-dump {temp_path}")
            result = subprocess.run(
                ['clang', '-Xclang', '-ast-dump', temp_path],
                capture_output=True,
                text=True,
                timeout=10
            )
            
            print("\n=== Clang output ===")
            print(f"Return code: {result.returncode}")
            print("\n=== Clang stdout ===")
            print(result.stdout[:500])  # Print only first 500 chars to avoid flooding
            if result.stderr:
                print("\n=== Clang stderr ===")
                print(result.stderr)

            # Placeholder for actual complexity analysis logic
            print("\n=== Analysis complete ===")
            print("Returning placeholder complexity")
            return "O(n),O(1)"
            
        except subprocess.TimeoutExpired:
            print("=== ERROR ===")
            print("Clang command timed out")
            return "ERROR: Analysis timed out"
        except subprocess.CalledProcessError as e:
            print("=== ERROR ===")
            print(f"Clang returned error code {e.returncode}")
            print(f"Output: {e.output}")
            return f"ERROR: Clang error: {str(e)}"
        except Exception as e:
            print("=== ERROR ===")
            print("Error running Clang:")
            print(traceback.format_exc())
            return f"ERROR: Failed to analyze code: {str(e)}"
            
    except Exception as e:
        print("=== ERROR ===")
        print("Unhandled error in analyze_cpp_code:")
        print(traceback.format_exc())
        return f"ERROR: Internal error: {str(e)}"

    finally:
        # Always clean up temp file
        if temp_path and os.path.exists(temp_path):
            try:
                os.unlink(temp_path)
                print(f"\n=== Cleanup ===")
                print(f"Deleted temp file: {temp_path}")
            except Exception as e:
                print("=== ERROR ===")
                print(f"Error deleting temp file: {str(e)}")

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("=== ERROR ===")
        print("Usage: python analyzeComplexity.py <cpp_file>")
        sys.exit(1)
    
    cpp_file = sys.argv[1]
    if not os.path.exists(cpp_file):
        print("=== ERROR ===")
        print(f"File not found: {cpp_file}")
        sys.exit(1)
    
    with open(cpp_file, 'r') as f:
        code = f.read()
    
    result = analyze_cpp_code(code)
    print(result)
