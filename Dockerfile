FROM node:16

# Set working directory
WORKDIR /doorfront

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy all source code
COPY . .

# Build client and server
RUN npm run build --prefix app && npm run server-build

# Set environment
ENV NODE_ENV=production
ENV PORT=8080

# Expose port (optional for Cloud Run/GCP)
EXPOSE 8080

# Start server
CMD ["npm", "start"]
