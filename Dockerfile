# 1. Build fase
FROM node:20-alpine AS build

WORKDIR /app

# Dependencies installeren
COPY package*.json ./
RUN npm install

# Source code kopiëren
COPY . .

# Build uitvoeren
RUN npm run build

# 2. Serve fase met Nginx
FROM nginx:alpine

# Nginx config kopiëren
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Build output kopiëren
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
RUN cat /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
