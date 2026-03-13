# Build stage
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Install simple server
RUN npm install -g serve

# Copy built artifacts from builder
COPY --from=builder /app/dist ./dist

# Cloud Run injects $PORT — use a shell so $PORT is expanded at runtime
CMD serve -s dist -l tcp://0.0.0.0:${PORT:-3000}
