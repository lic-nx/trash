#!/bin/bash

echo "🚀 Setting up WikiLive Development Environment"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v)
echo "✅ Node.js version: $NODE_VERSION"

# Install root dependencies
echo ""
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo ""
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install mock-api dependencies
echo ""
echo "📦 Installing mock-api dependencies..."
cd mock-api
npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎯 To start the development server:"
echo "   npm run dev"
echo ""
echo "📱 Frontend will be available at: http://localhost:3000"
echo "🔌 Backend API at: http://localhost:3001"
echo "🎭 Mock API at: http://localhost:3002"
echo ""
