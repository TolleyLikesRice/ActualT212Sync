FROM node:20-slim

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --prod --frozen-lockfile --dangerously-allow-all-builds

# Copy your script and rest of the project
COPY . .

CMD ["pnpm", "start"]
