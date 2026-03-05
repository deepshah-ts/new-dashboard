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

EXPOSE 3000

# Start serving the dist folder on port 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
