# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build TypeScript
RUN npm run build

# Production stage
FROM node:20-slim

WORKDIR /app

# Install openssl for Prisma
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

EXPOSE 8000

# Script to run migrations and start
# We use npx prisma db push for SQLite in this demo setup
CMD ["sh", "-c", "npx prisma db push && node dist/src/index.js"]
