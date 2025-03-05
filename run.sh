#!/bin/bash
# run.sh
# Script to start both the backend API and frontend server for PDF to Structured Data

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Directory setup
ROOT_DIR="$(pwd)"
BACKEND_DIR="$ROOT_DIR"
FRONTEND_DIR="$ROOT_DIR/frontend"
TEMP_DIR="$ROOT_DIR/temp_uploads"

# Create temp uploads directory if it doesn't exist
mkdir -p "$TEMP_DIR"

# Clear the screen
clear

echo -e "${BLUE}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}║${NC}  ${GREEN}PDF to Structured Data - Startup Script${NC}              ${BLUE}║${NC}"
echo -e "${BLUE}║                                                        ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════╝${NC}"
echo

# Store PIDs to clean up later
BACKEND_PID=""
FRONTEND_PID=""

# Function to clean up on exit
cleanup() {
    echo
    echo -e "${YELLOW}Shutting down servers...${NC}"
    
    # Kill the backend process if it exists
    if [ -n "$BACKEND_PID" ]; then
        echo "Stopping backend API (PID: $BACKEND_PID)..."
        kill -TERM "$BACKEND_PID" 2>/dev/null || true
    fi
    
    # Kill the frontend process if it exists
    if [ -n "$FRONTEND_PID" ]; then
        echo "Stopping frontend server (PID: $FRONTEND_PID)..."
        kill -TERM "$FRONTEND_PID" 2>/dev/null || true
    fi
    
    echo -e "${GREEN}All servers stopped. Goodbye!${NC}"
    exit 0
}

# Set up trap to capture SIGINT (Ctrl+C) and other signals
trap cleanup SIGINT SIGTERM

# Check if .env file exists
if [ ! -f "$BACKEND_DIR/.env" ]; then
    echo -e "${YELLOW}Warning: .env file not found. Creating a sample .env file.${NC}"
    echo "GOOGLE_API_KEY=your_api_key_here" > "$BACKEND_DIR/.env"
    echo -e "${YELLOW}Please edit .env and add your Google API key before using the application.${NC}"
    echo
fi

# Start backend API
echo -e "${GREEN}Starting backend API server...${NC}"
cd "$BACKEND_DIR"
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait a moment to ensure backend has started
sleep 2

# Check if backend started successfully
if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Backend API server started successfully!${NC}"
    echo -e "  API running at: ${BLUE}http://localhost:8000${NC}"
    echo -e "  API docs at: ${BLUE}http://localhost:8000/docs${NC}"
else
    echo -e "${YELLOW}⚠ Backend API server failed to start. Please check for errors above.${NC}"
    cleanup
fi

# Start frontend server
echo 
echo -e "${GREEN}Starting frontend server...${NC}"
cd "$FRONTEND_DIR"
python -m http.server 8080 &
FRONTEND_PID=$!

# Wait a moment to ensure frontend has started
sleep 2

# Check if frontend started successfully
if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Frontend server started successfully!${NC}"
    echo -e "  Frontend running at: ${BLUE}http://localhost:8080${NC}"
else
    echo -e "${YELLOW}⚠ Frontend server failed to start. Please check for errors above.${NC}"
    cleanup
fi

echo 
echo -e "${GREEN}╔════════════════════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║${NC}  All services are running!                            ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}  • Backend API: ${BLUE}http://localhost:8000${NC}                 ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}  • Frontend:    ${BLUE}http://localhost:8080${NC}                 ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}                                                        ${GREEN}║${NC}"
echo -e "${GREEN}║${NC}  Press ${YELLOW}Ctrl+C${NC} to stop all servers                      ${GREEN}║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════════════════════╝${NC}"

# Keep the script running
wait
