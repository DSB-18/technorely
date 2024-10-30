# Use the official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app
COPY . .

# Build the React app
RUN npm run build

# Serve the app with a lightweight web server
RUN npm install -g serve

# Expose the port the app runs on
EXPOSE 3001

# Serve the app
CMD ["serve", "-s", "build", "-l", "3001"]
