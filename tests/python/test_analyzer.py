import sys
import os
import unittest

# Add the parent directory to the path so we can import the analyzer
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../../backend/services')))

from analyzeComplexity import analyze_cpp_code, analyze_with_regex, analyze_with_ast, preprocess_cpp_to_c

class TestComplexityAnalyzer(unittest.TestCase):

    def test_constant_time_complexity(self):
        code = """
        #include <iostream>

        int main() {
            int a = 5;
            int b = 10;
            int sum = a + b;
            std::cout << "Sum: " << sum << std::endl;
            return 0;
        }
        """
        result = analyze_cpp_code(code)
        self.assertEqual(result, "O(1),O(1)")

    def test_linear_time_complexity(self):
        code = """
        #include <iostream>

        int main() {
            int n = 10;
            int sum = 0;

            for (int i = 0; i < n; i++) {
                sum += i;
            }

            std::cout << "Sum: " << sum << std::endl;
            return 0;
        }
        """
        result = analyze_cpp_code(code)
        self.assertEqual(result, "O(n),O(1)")

    def test_quadratic_time_complexity(self):
        code = """
        #include <iostream>

        int main() {
            int n = 10;

            for (int i = 0; i < n; i++) {
                for (int j = 0; j < n; j++) {
                    std::cout << i * j << " ";
                }
                std::cout << std::endl;
            }

            return 0;
        }
        """
        result = analyze_cpp_code(code)
        self.assertEqual(result, "O(n^2),O(1)")

    def test_recursive_time_complexity(self):
        code = """
        #include <iostream>

        int fibonacci(int n) {
            if (n <= 1) {
                return n;
            }
            return fibonacci(n-1) + fibonacci(n-2);
        }

        int main() {
            int result = fibonacci(10);
            std::cout << "Fibonacci: " << result << std::endl;
            return 0;
        }
        """
        result = analyze_cpp_code(code)
        self.assertEqual(result, "O(2^n),O(1)")

    def test_linear_space_complexity(self):
        code = """
        #include <iostream>
        #include <vector>

        int main() {
            int n = 10;
            std::vector<int> data(n);

            for (int i = 0; i < n; i++) {
                data[i] = i * 2;
            }

            for (int val : data) {
                std::cout << val << " ";
            }

            return 0;
        }
        """
        result = analyze_cpp_code(code)
        self.assertTrue("O(n)" in result)  # Space complexity should be O(n)

    def test_cpp_to_c_conversion(self):
        cpp_code = """
        #include <iostream>
        #include <vector>
        using namespace std;

        class MyClass {
            int x;
        public:
            void setX(int val) { x = val; }
        };

        int main() {
            vector<int> vec;
            MyClass obj;
            obj.setX(10);
            return 0;
        }
        """
        c_code = preprocess_cpp_to_c(cpp_code)
        # Verify includes are processed
        self.assertNotIn("#include <iostream>", c_code)
        self.assertNotIn("#include <vector>", c_code)
        # Verify 'using namespace' is removed
        self.assertNotIn("using namespace std", c_code)
        # Verify class is removed or processed
        self.assertNotIn("class MyClass", c_code)

    def test_analyze_with_regex(self):
        # Simple for loop
        code = "for (int i = 0; i < n; i++) { sum += i; }"
        time, space = analyze_with_regex(code)
        self.assertEqual(time, "O(n)")
        self.assertEqual(space, "O(1)")

        # Nested loops
        code = "for (int i = 0; i < n; i++) { for (int j = 0; j < n; j++) { sum += i * j; } }"
        time, space = analyze_with_regex(code)
        self.assertEqual(time, "O(n^2)")
        self.assertEqual(space, "O(1)")

if __name__ == "__main__":
    unittest.main()
