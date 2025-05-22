#!/bin/bash

echo "Starting CPP Analyzer application..."

# Default to development mode
ENV=${1:-"development"}

if [ "$ENV" = "production" ]; then
  # Production mode
  echo "Starting in PRODUCTION mode..."

  # Build frontend
  echo "Building frontend..."
  cd frontend
  bun run build
  cd ..

  # Start backend in production mode
  echo "Starting backend server..."
  NODE_ENV=production npm start

else
  # Development mode
  echo "Starting in DEVELOPMENT mode..."

  # Start both frontend and backend in development mode
  npm run dev
fi
