FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY public/ ./public/
COPY src/ ./src/
COPY scripts/ ./scripts/
COPY index.html vite.config.js postcss.config.js eslint.config.js ./

RUN npm run build

FROM nginxinc/nginx-unprivileged:alpine

COPY --from=builder --chown=root:root /app/dist /usr/share/nginx/html
COPY --chown=root:root nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
