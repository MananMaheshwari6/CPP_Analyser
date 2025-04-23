import os
from clang import cindex

# Replace with actual path to your LLVM installation
llvm_path = r"C:\Program Files\LLVM\bin"
cindex.Config.set_library_file(os.path.join(llvm_path, "libclang.dll"))


def count_loops_and_allocations(node, loop_count=0, alloc_count=0, recursion=False, func_name=None):
    if node.kind == cindex.CursorKind.FOR_STMT or node.kind == cindex.CursorKind.WHILE_STMT:
        loop_count += 1

    elif node.kind == cindex.CursorKind.CALL_EXPR:
        if node.spelling == func_name:
            recursion = True  # recursion detected

    elif node.kind == cindex.CursorKind.CXX_NEW_EXPR or node.kind == cindex.CursorKind.CALL_EXPR:
        if "alloc" in node.spelling.lower() or node.spelling.lower() in ['malloc', 'calloc']:
            alloc_count += 1

    for child in node.get_children():
        loop_count, alloc_count, recursion = count_loops_and_allocations(
            child, loop_count, alloc_count, recursion, func_name)

    return loop_count, alloc_count, recursion

def analyze_cpp_code(code):
    with tempfile.NamedTemporaryFile(mode='w+', suffix='.cpp', delete=False) as temp:
        temp.write(code)
        temp.flush()

        index = cindex.Index.create()
        tu = index.parse(temp.name)

        if not tu:
            return "O(1),O(1)"

        loop_count, alloc_count, recursion = count_loops_and_allocations(tu.cursor, func_name="main")

        # Heuristic rules
        if recursion:
            time_complexity = "O(2^n)"
        elif loop_count >= 2:
            time_complexity = "O(n^2)"
        elif loop_count == 1:
            time_complexity = "O(n)"
        else:
            time_complexity = "O(1)"

        space_complexity = "O(n)" if alloc_count > 0 else "O(1)"

        return f"{time_complexity},{space_complexity}"

# Read from stdin (Node sends the code)
code = sys.stdin.read()
result = analyze_cpp_code(code)
print(result)
