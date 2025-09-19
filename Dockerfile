# ---- Stage 1: Build the React App ----
# Use an official Node.js image as the builder environment
FROM node:18-alpine as builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker cache
COPY package*.json ./

# Install project dependencies
RUN npm install

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

# Copy our custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 to the outside world
EXPOSE 80

# The command to start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]
