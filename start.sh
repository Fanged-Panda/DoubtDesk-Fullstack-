#!/bin/bash

# DoubtDesk Quick Start Script
# Run this script to setup and start the entire application

set -e

echo "================================"
echo "DoubtDesk - Quick Start Script"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

echo -e "${BLUE}✓ Node.js version:${NC} $(node --version)"
echo -e "${BLUE}✓ npm version:${NC} $(npm --version)"
echo ""

# Determine action
ACTION=${1:-dev}

case $ACTION in
    setup)
        echo -e "${BLUE}Setting up DoubtDesk...${NC}"
        npm run setup
        echo -e "${GREEN}✓ Setup complete!${NC}"
        echo ""
        echo "Next, run: npm run dev"
        ;;
    dev|start)
        echo -e "${BLUE}Starting DoubtDesk in development mode...${NC}"
        echo ""
        echo -e "${GREEN}Backend will run on: http://localhost:3001${NC}"
        echo -e "${GREEN}Frontend will run on: http://localhost:5173${NC}"
        echo ""
        echo "Press Ctrl+C to stop both servers"
        echo ""
        npm run dev
        ;;
    backend)
        echo -e "${BLUE}Starting backend only...${NC}"
        echo -e "${GREEN}Backend running on: http://localhost:3001${NC}"
        npm run dev:backend
        ;;
    frontend)
        echo -e "${BLUE}Starting frontend only...${NC}"
        echo -e "${GREEN}Frontend running on: http://localhost:5173${NC}"
        npm run dev:frontend
        ;;
    build)
        echo -e "${BLUE}Building frontend for production...${NC}"
        npm run build
        echo -e "${GREEN}✓ Build complete! Output in: ddfrontend/my-project/dist${NC}"
        ;;
    *)
        echo "Usage: $0 {setup|dev|start|backend|frontend|build}"
        echo ""
        echo "Commands:"
        echo "  setup     - First-time setup (install dependencies)"
        echo "  dev       - Start both backend and frontend (default)"
        echo "  start     - Alias for 'dev'"
        echo "  backend   - Start backend only"
        echo "  frontend  - Start frontend only"
        echo "  build     - Build frontend for production"
        exit 1
        ;;
esac
