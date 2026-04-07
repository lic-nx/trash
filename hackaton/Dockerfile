# WikiLive Multi-Stage Docker Build

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source code
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install

# Copy backend source code
COPY backend/ ./

# Stage 3: Mock API
FROM node:18-alpine AS mock-api-builder

WORKDIR /app/mock-api

# Copy mock-api package files
COPY mock-api/package*.json ./

# Install mock-api dependencies
RUN npm install

# Copy mock-api source code
COPY mock-api/ ./

# Stage 4: Production Image
FROM node:18-alpine AS production

WORKDIR /app

# Install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=frontend-builder /app/frontend/package.json ./frontend/

# Copy backend
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/src ./backend/src
COPY --from=backend-builder /app/backend/package.json ./backend/

# Copy mock-api
COPY --from=mock-api-builder /app/mock-api/node_modules ./mock-api/node_modules
COPY --from=mock-api-builder /app/mock-api/server.js ./mock-api/
COPY --from=mock-api-builder /app/mock-api/package.json ./mock-api/

# Copy configuration files
COPY frontend/vite.config.ts ./frontend/
COPY frontend/tailwind.config.js ./frontend/
COPY frontend/postcss.config.js ./frontend/
COPY frontend/tsconfig.json ./frontend/

# Create non-root user
RUN addgroup -g 1001 -S nodejs 
    && adduser -S nextjs -u 1001

USER nextjs

# Expose ports
EXPOSE 3000 3001 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start all services
CMD [\"sh\", \"-c\", \"\\
  node mock-api/server.js & \\
  node backend/src/index.js & \\
  cd frontend && npx serve dist -l 3000\\
\"]
