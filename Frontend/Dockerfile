#
# --- Stage 1: Build the Angular Application ---
# Uses a Node.js image to install dependencies and compile the project.
#
FROM node:20-alpine AS builder

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to leverage Docker layer caching.
# This ensures dependencies are only reinstalled if these files change.
COPY package.json package-lock.json ./

# Install dependencies (using npm install)
RUN npm install

# Copy the rest of the application files (source code, config files, etc.)
COPY . .

# Build the Angular application for production.
# The output path will be 'dist/Frontend/browser' relative to the /app workdir.
# This is the default structure when using the application builder with your angular.json configuration.
RUN npm run build -- --configuration=production

#
# --- Stage 2: Serve the Static Assets using NGINX ---
# Uses a minimal Nginx image to serve the compiled, static assets.
#
FROM nginx:stable-alpine AS runner

# Remove the default Nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy your custom Nginx configuration file from the Frontend directory
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built application files from the 'builder' stage into the Nginx serving directory.
# The source path is the output of the Angular build command from Stage 1.
COPY --from=builder /app/dist/Frontend/browser /usr/share/nginx/html

# Expose port 80 (standard HTTP)
EXPOSE 80

# Start Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
