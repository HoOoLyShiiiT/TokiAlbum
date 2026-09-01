# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend & Production Image
FROM node:20-alpine AS runner
WORKDIR /app

# Install native dependencies required by sharp / SQLite
RUN apk add --no-cache python3 make g++ sqlite

# Build backend
COPY backend/package*.json ./backend/
WORKDIR /app/backend
RUN npm ci --only=production

COPY backend/ ./

# Copy built frontend assets to frontend/dist so Express serves them
COPY --from=frontend-builder /app/frontend/dist /app/frontend/dist

# Expose server port
EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production
ENV UPLOAD_DIR=/app/uploads
ENV DATABASE_PATH=/app/data/knipsen.db

# Persistent storage volumes for uploaded media and SQLite DB
VOLUME ["/app/uploads", "/app/data"]

CMD ["node", "src/index.js"]
