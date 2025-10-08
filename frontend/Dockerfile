# Build stage
FROM node:18 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine AS final
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]