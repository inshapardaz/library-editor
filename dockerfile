FROM node:18-alpine as build

WORKDIR /app

# Install packages
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent

# Build app
COPY . /app
RUN npm run build



FROM nginx:alpine

COPY --from=build /app/public /usr/share/nginx/html
COPY config/nginx/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
