#!/bin/bash

# Run backend tests
echo "Running backend API tests..."
NODE_ENV=test npm run test:backend

# Run Python tests
echo "Running Python analyzer tests..."
if [ -d "tests/python" ]; then
  # Check if pytest is installed
  if command -v pytest &> /dev/null; then
    pytest tests/python
  elif command -v python3 -m pytest &> /dev/null; then
    python3 -m pytest tests/python
  elif command -v python -m pytest &> /dev/null; then
    python -m pytest tests/python
  else
    echo "pytest is not installed. Installing required packages..."
    pip install -r tests/python/requirements.txt || pip3 install -r tests/python/requirements.txt
    python -m pytest tests/python || python3 -m pytest tests/python
  fi
fi

# Run frontend tests
echo "Running frontend tests..."
cd frontend
bun test
cd ..

echo "All tests completed!"
