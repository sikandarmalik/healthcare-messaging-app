FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY server/package.json ./server/
COPY server/prisma ./server/prisma/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY server ./server/

# Generate Prisma client
RUN cd server && pnpm db:generate

# Build application
RUN cd server && pnpm build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./
COPY server/package.json ./server/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy Prisma schema and generate client
COPY server/prisma ./server/prisma/
RUN cd server && npx prisma generate

# Copy built application
COPY --from=builder /app/server/dist ./server/dist

# Create uploads directory
RUN mkdir -p /app/server/uploads

WORKDIR /app/server

EXPOSE 3000

CMD ["node", "dist/main.js"]
