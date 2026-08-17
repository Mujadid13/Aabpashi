# Multi-stage Dockerfile for AabPashi Web Application

# Base stage for shared dependencies
FROM node:18-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./
COPY next.config.mjs ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Install dependencies
RUN npm install --omit=dev && npm cache clean --force

# Development stage
FROM base AS development

# Install curl for health checks and all dependencies including dev dependencies
RUN apk add --no-cache curl && npm install

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Start development server with hot reload
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS builder

# Install all dependencies including dev dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM node:18-alpine AS production

# Install dependencies for native modules
RUN apk add --no-cache libc6-compat

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/proxy.ts ./
COPY --from=builder /app/data ./data

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of the app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Start production server
CMD ["npm", "start"] 