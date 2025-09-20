# ---- Stage 1: Build the React App ----
# Use an official Node.js image as the builder environment
FROM node:20-alpine as builder

# Set the working directory inside the container
WORKDIR /app
RUN apk add --no-cache gettext
RUN apk add --no-cache python3 make g++
# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./
COPY package-lock.json ./

RUN ls -la
# Install project dependencies
RUN npm ci

# Copy the rest of the application's source code
COPY . .

# Build the application for production
# The output will be in the /app/dist folder (for Vite)
RUN npm run build


# ---- Stage 2: Serve the App with Nginx ----
# Use a lightweight Nginx image for the final container
FROM nginx:1.23-alpine

# Copy the built static files from the 'builder' stage
# Note: Vite builds to a 'dist' folder. If you used Create React App, it would be 'build'.
COPY --from=builder /app/build /usr/share/nginx/html

RUN mkdir -p /etc/nginx/template

# Copy our custom Nginx configuration
COPY nginx.conf.template /etc/nginx/template/nginx.conf.template

COPY start.sh /start.sh
RUN chmod +x /start.sh

# Expose port 8080 to the outside world
EXPOSE 8080

# The command to start Nginx when the container launches
ENTRYPOINT ["/start.sh"]
