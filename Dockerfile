FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm

# Install Python and build dependencies for native modules
RUN apt-get update && apt-get install -y python3 make g++ && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --prod --frozen-lockfile --dangerously-allow-all-builds

# Copy your script and rest of the project
COPY . .

CMD ["pnpm", "start"]