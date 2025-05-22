#!/bin/bash

echo "Installing CPP Analyzer dependencies..."

# Install Node.js dependencies for the backend
echo "Installing backend dependencies..."
npm install

# Install frontend dependencies using Bun
echo "Installing frontend dependencies..."
cd frontend
npm install bun -g
bun install
cd ..

# Create a .env file if it doesn't exist
if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo "MONGO_URI=mongodb+srv://mananbe0p:manan123@cluster0.dphgfse.mongodb.net/" > .env
  echo "PORT=5001" >> .env
fi

echo "Installation completed successfully!"
echo "To start the application, run: npm run dev"
