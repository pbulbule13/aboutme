# Multi-stage build for optimized production image

# Stage 1: Build the application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application for Cloud Run (root path)
ENV DEPLOY_TARGET=cloudrun
RUN npm run build

# Stage 2: Production server
FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy server file
COPY server.js ./

# Copy built assets from builder
COPY --from=builder /app/dist ./dist

# Expose port 8080 (Cloud Run requirement)
EXPOSE 8080

# Start the Node server
CMD ["node", "server.js"]
