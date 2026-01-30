# Multi-stage build for pravia-idp-api with workspace dependencies
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace root files
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy ONLY the workspace packages this service needs
COPY packages/api-core ./packages/api-core
COPY packages/api-types ./packages/api-types

# Copy this service
COPY apps/pravia-idp-api ./apps/pravia-idp-api

# Install dependencies and build
RUN pnpm install --no-frozen-lockfile --filter=pravia-idp-api...
RUN cd apps/pravia-idp-api && pnpm build

# Production stage
FROM node:20-alpine AS production

# Install pnpm
RUN npm install -g pnpm

WORKDIR /app

# Copy workspace files
COPY package.json ./
COPY pnpm-lock.yaml ./
COPY pnpm-workspace.yaml ./

# Copy ONLY required workspace packages
COPY packages/api-core ./packages/api-core
COPY packages/api-types ./packages/api-types

# Copy service package.json
COPY apps/pravia-idp-api/package.json ./apps/pravia-idp-api/

# Install only production dependencies
RUN pnpm install --no-frozen-lockfile --filter=pravia-idp-api... --prod

# Copy built application from builder stage
COPY --from=builder /app/apps/pravia-idp-api/dist ./apps/pravia-idp-api/dist

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "apps/pravia-idp-api/dist/src/main.js"]
