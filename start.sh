#!/bin/bash
echo "=========================================="
echo "  CertAuth - Starting Full Stack App"
echo "  SIH 2025 - PS #SIH25029"
echo "=========================================="

# Start backend
echo "[1/2] Installing & starting backend..."
cd backend && npm install && npm run dev &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

sleep 3

# Start frontend
echo "[2/2] Installing & starting frontend..."
cd ../frontend && npm install && npm start &
FRONTEND_PID=$!

echo ""
echo "=========================================="
echo " Backend:  http://localhost:5000"
echo " Frontend: http://localhost:3000"
echo "=========================================="
echo ""
echo "Press Ctrl+C to stop all servers"

wait
