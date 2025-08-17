
# # Build stage
# FROM node:18-alpine AS build
# WORKDIR /app

# COPY package*.json ./
# RUN npm ci
# RUN npm install -g @angular/cli

# COPY . .
# RUN ng build --configuration=production

# # Production stage
# FROM nginx:alpine

# # Remove default nginx content
# RUN rm -rf /usr/share/nginx/html/*

# # Copy from the browser subfolder directly
# COPY --from=build /app/dist/role-based-dashboard/browser/ /usr/share/nginx/html/

# # Copy nginx config
# COPY nginx.conf /etc/nginx/nginx.conf

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]

# # build  docker build -t role-based-dashboard .

# # run container docker run -p 8080:80 role-based-dashboard // docker run -p 8081:80 role-based-dashboard
# # http://localhost:3000/docs

 # Use Node.js LTS version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first for better Docker layer caching
COPY package*.json ./

# Clear npm cache and install dependencies
RUN npm cache clean --force && \
    npm config set registry https://registry.npmjs.org/ && \
    npm install --legacy-peer-deps

# Install Angular CLI globally
RUN npm install -g @angular/cli@latest

# Copy source code
COPY . .

# Expose port
EXPOSE 4200

# Start the development server
CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200", "--poll=2000"]
