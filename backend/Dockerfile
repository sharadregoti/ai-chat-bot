# Use official Node.js LTS image
FROM node:latest

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY server.js .

# Run the server using compiled JS (adjust if JS-only project)
CMD ["node", "server.js"]
