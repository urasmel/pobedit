# syntax=docker/dockerfile:1.4

# 1. For build React app
FROM node:lts AS development

# Set working directory
WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV CI=true
ENV PORT=3000

FROM development AS build
RUN CI=false npm run build

FROM nginx:alpine

COPY .nginx/nginx.conf /etc/nginx/conf.d/default.conf

RUN rm -rf /usr/share/nginx/html/*

# Copy static assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Containers run nginx with global directives and daemon off
ENTRYPOINT ["nginx", "-g", "daemon off;"]
