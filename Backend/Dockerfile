# Use Node 20
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and lock file
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy rest of the code
COPY . .

# Build the backend
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app in production
CMD ["npm", "run", "start:prod"]
