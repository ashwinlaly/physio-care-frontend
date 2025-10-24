FROM node:20-alpine as builder

WORKDIR /app
RUN apk add --no-cache gettext
RUN apk add --no-cache python3 make g++
COPY package*.json ./
COPY package-lock.json ./

RUN ls -la
RUN npm ci
ENV REACT_APP_API_BASE_URL=https://icure-backend-434067823144.asia-southeast1.run.app/api/v1
ENV REACT_APP_API_URL=https://icure-backend-434067823144.asia-southeast1.run.app/api/v1

COPY . .

RUN rm -rf build node_modules/.cache || true
RUN npm run build
FROM nginx:1.23-alpine
COPY --from=builder /app/build /usr/share/nginx/html

RUN mkdir -p /etc/nginx/template

COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template

COPY start.sh /start.sh
RUN chmod +x /start.sh
EXPOSE 8080
ENTRYPOINT ["/start.sh"]
