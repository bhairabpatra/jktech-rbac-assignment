# Build stage
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm cache clean --force
RUN npm install -g @angular/cli
RUN npm install

# Copy source and build
COPY . .
RUN ng build --configuration=production

# Production stage
FROM nginx:alpine

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy built application
COPY --from=build /app/dist/role-based-dashboard/browser/ /usr/share/nginx/html/

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]

# build  docker build -t role-based-dashboard .

# run container docker run -p 8080:80 role-based-dashboard // docker run -p 8081:80 role-based-dashboard
# http://localhost:3000/docs
