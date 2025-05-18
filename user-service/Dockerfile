# Use official Node.js LTS image as base
FROM node:18-alpine

# Create app directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Expose port your service listens on
EXPOSE 3001

# Start the app
CMD ["node", "index.js"]
