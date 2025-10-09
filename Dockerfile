FROM node:20-alpine as builder

WORKDIR /app
# RUN apk add --no-cache gettext
# RUN apk add --no-cache python3 make g++
COPY package*.json ./
COPY package-lock.json ./

RUN ls -la
RUN npm ci

COPY . .

RUN npm run build
FROM nginx:1.23-alpine
COPY --from=builder /app/build /usr/share/nginx/html

RUN mkdir -p /etc/nginx/template

COPY nginx.conf.template /etc/nginx/templates/nginx.conf.template

COPY start.sh /start.sh
RUN chmod +x /start.sh
EXPOSE 8080
ENTRYPOINT ["/start.sh"]
