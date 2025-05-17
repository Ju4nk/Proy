#!/bin/bash
# run.sh: Script para preparar y arrancar la aplicación full‑stack

set -e  # Salir si hay errores

# 1) BACKEND
echo "📦 Installing backend dependencies..."
cd backend
npm install

echo "🔍 Checking for backend .env file..."
if [ ! -f .env ]; then
  if [ -f .env.example ]; then
    cp .env.example .env
    echo "  → Created .env from .env.example"
  else
    echo "  ❌ No .env or .env.example found in backend/."
    exit 1
  fi
fi

echo "🏗️  Building backend..."
npm run build

echo "🏃‍♂️ Running backend migrations..."
npx ts-node -r tsconfig-paths/register ./node_modules/typeorm/cli.js migration:run \
  --dataSource ./src/data-source.ts

echo "🚀 Starting backend (dev mode)..."
npm run start:dev &   # lo lanzamos en segundo plano
BACKEND_PID=$!

cd ..

# 2) FRONTEND
echo "📦 Installing frontend dependencies..."
cd frontend
npm install

echo "🚀 Starting frontend..."
npm run dev &        # también en background
FRONTEND_PID=$!

cd ..

# 3) Esperar al cierre de cualquiera
echo "✅ Both services are up! (PIDs: backend=$BACKEND_PID frontend=$FRONTEND_PID)"
wait $BACKEND_PID $FRONTEND_PID
