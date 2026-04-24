FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable npm && corepack prepare npm@11.13.0 --activate
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
