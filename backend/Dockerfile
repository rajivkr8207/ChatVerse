# Build backend dependencies
FROM node:20-alpine AS backend-deps
WORKDIR /app
COPY backend/package*.json ./
RUN npm install --production

# Build frontend assets
FROM node:20-alpine AS frontend-build
WORKDIR /frontend
COPY frontend/package*.json ./
COPY frontend .
RUN npm install
RUN npm run build

# Final backend image with frontend dist copied into public/dist
FROM node:20-alpine
WORKDIR /app
COPY --from=backend-deps /app/node_modules ./node_modules
COPY backend .
COPY --from=frontend-build /frontend/dist ./public/dist
CMD ["node", "server.js"]