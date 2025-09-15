FROM node:20-slim

# Set working directory inside the container
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Copy the lib directory (needed for parserlib dependency)
COPY lib/ ./lib/

# Install dependencies
RUN npm ci

# Copy rest of project files
COPY . .

# Build client and server
RUN npm run compile

# Production environment
ENV NODE_ENV=production

# Cloud Run provides PORT env var
CMD ["npm", "run", "server"]