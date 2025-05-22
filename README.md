# CPP_Analyser

A web application for analyzing C++ code to determine its time and space complexity.

## Features

- Analyzes C++ code to determine time and space complexity
- Provides visual representation of complexity with charts
- Stores analysis history
- User-friendly interface with code editor
- Supports file upload for C++ code files

## Project Structure

- **Backend**: Node.js with Express
  - API endpoints for code analysis and history retrieval
  - MongoDB for data storage (with in-memory fallback)

- **Frontend**: React with TypeScript
  - Modern UI with responsive design
  - Code editor for C++ input
  - Visualization of analysis results
  - History view of past analyses

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (optional)
- Bun package manager

### Installation

1. Clone the repository
```
git clone https://github.com/MananMaheshwari6/CPP_Analyser.git
cd CPP_Analyser
```

2. Install dependencies
```
npm run install-all
```

3. Set up environment variables
```
MONGO_URI=your_mongodb_connection_string
```

4. Start the application
```
npm run dev
```

## Usage Guide

1. **Login**: Use any username/password (authentication is mocked for demo)

2. **Dashboard**: View your analysis statistics

3. **Analyzer**: Input or upload C++ code for analysis
   - Type directly in the editor
   - Upload a .cpp file
   - Click "Analyze Complexity"

4. **Results**: View the analysis results
   - Time complexity (O(1), O(n), O(n²), etc.)
   - Space complexity
   - Visual representations
   - Execution time estimates

## Code Analysis Examples

### Constant Time: O(1)
```cpp
#include <iostream>

int main() {
    int a = 5;
    int b = 10;
    int sum = a + b;
    std::cout << "Sum: " << sum << std::endl;
    return 0;
}
```

### Linear Time: O(n)
```cpp
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
```

### Quadratic Time: O(n²)
```cpp
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
```

## Contributors

- [MananMaheshwari6](https://github.com/MananMaheshwari6)
- [KaranSinghDhanik](https://github.com/KaranSinghDhanik)
- [manjul05](https://github.com/manjul05)
