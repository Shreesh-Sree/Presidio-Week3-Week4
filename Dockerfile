# --- STAGE 1: BUILD ENVIRONMENT ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency configs
COPY package*.json ./

# Clean installation of dependencies
RUN npm ci

# Copy codebase
COPY . .

# Run build step to compile static asset bundles
RUN npm run build

# --- STAGE 2: PRODUCTION RUNTIME ENVIRONMENT ---
FROM nginx:1.25-alpine AS runner

# Copy production compiled assets from stage 1 builder to Nginx server html path
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration if needed (otherwise defaults to standard fallback)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
