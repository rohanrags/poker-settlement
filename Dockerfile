# Stage 1: Builder
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
# Use clean install for reproducible builds
RUN npm ci

# Copy source code
COPY . .

# Build the application
# Check if VITE_GEMINI_API_KEY needs to be passed as build arg, or if it's handled at runtime/client-side.
# Since the security audit noted it's injected into client bundle, we assume it's needed at build time OR env var injection.
# For now, we'll run the build command.
RUN npm run build

# Stage 2: Runner
FROM nginx:alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
