import sys
import clang.cindex

print("Python and Clang are working!")
print("Python version:", sys.version)
print("Clang version:", clang.cindex.getClangVersion())

# Test file reading
if __name__ == "__main__":
    if len(sys.argv) > 1:
        with open(sys.argv[1], 'r') as f:
            print("File content:", f.read())
    else:
        print("No file provided")
