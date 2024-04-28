FROM node:18-alpine as build

WORKDIR /app

# Install packages
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# Build app
COPY ./src ./src
RUN npm run build

# Stage 2
###########################################
FROM nginx:alpine

# Copy nginx configuration
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf

# Copy the built React app to Nginx's web server directory
COPY --from=build /app/dist /usr/share/nginx/html

# Expose port 80 for the Nginx server
EXPOSE 80

# Start Nginx when the container runs
CMD ["nginx", "-g", "daemon off;"]
