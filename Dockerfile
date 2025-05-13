# Use a lightweight Node.js base image
# FROM node:20-alpine

# Set working directory
# WORKDIR /app

# Copy package.json and package-lock.json
# COPY package*.json ./

# Install dependencies
# RUN npm install

# FROM node:20-alpine AS builder
# WORKDIR /app

# 1.1 Copy manifests & install prod deps only
# COPY package*.json ./
# RUN npm ci --omit=dev \
#  && npm cache clean --force \
#  && npm install
# RUN npm install
# Copy the rest of the project
# COPY . .

# Expose the Vite default port
# EXPOSE 5173

# Start the development server
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]


# FROM node:20-alpine

# # Set working directory
# WORKDIR /app

# # Copy package.json and package-lock.json
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the project
# COPY . .

# # Expose the Vite default port
# EXPOSE 5173



# FROM node:20-alpine AS builder
# WORKDIR /app
# # Copy only package files first for caching
# COPY package*.json ./
# RUN npm install --frozen-lockfile --production && \
#     npm cache clean --force
# # Stage 2: Minimal production image
# FROM node:20-alpine
# WORKDIR /app
# # Copy only necessary files (exclude dev files)
# COPY --from=builder /app/node_modules ./node_modules
# COPY --from=builder /app/package*.json ./
# COPY public ./public
# COPY src ./src
# COPY vite.config.js ./
# # Drop root privileges & set non-root user
# USER node
# EXPOSE 5173
# # CMD ["npm", "run", "dev"]
# CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npm run build
FROM nginx:alpine AS production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# Stage 1: build assets
# FROM node:20-alpine AS builder
# WORKDIR /app
# COPY package*.json ./
# RUN npm ci --omit=dev && npm cache clean --force
# COPY . .
# RUN npm run build

# # Stage 2: serve static files via BusyBox HTTPD
# FROM busybox:1.30
# WORKDIR /app
# COPY --from=builder /app/dist .
# EXPOSE 8082
# CMD ["httpd", "-f", "-v", "-p", "8082"]