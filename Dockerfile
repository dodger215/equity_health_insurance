
FROM node:18-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker caching
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 3000 for the React development server
EXPOSE 3000

# Start the React app in development mode
CMD ["npm", "start"]
