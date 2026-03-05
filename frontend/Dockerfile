# Build stage
FROM node:20-slim AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built artifacts from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration template
COPY nginx.conf.template /etc/nginx/templates/default.conf.template

# Ensure the default config is removed to prevent conflicts
RUN rm -f /etc/nginx/conf.d/default.conf

EXPOSE 3000

# The default entrypoint will run envsubst on templates
CMD ["nginx", "-g", "daemon off;"]
