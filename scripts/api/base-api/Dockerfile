# Multi-stage build for pravia-incidents-api
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

# Copy this service
COPY api/incidents ./api/incidents

# Install dependencies and build
RUN pnpm install --no-frozen-lockfile --filter=@asyml8/pravia-incidents-api...
RUN cd api/incidents && pnpm build

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

# Copy service package.json
COPY api/incidents/package.json ./api/incidents/

# Install only production dependencies (ignore prepare scripts like husky)
RUN pnpm install --no-frozen-lockfile --filter=@asyml8/pravia-incidents-api... --prod --ignore-scripts

# Copy built application from builder stage
COPY --from=builder /app/api/incidents/dist ./api/incidents/dist

# Copy package.json for version info
COPY --from=builder /app/api/incidents/package.json ./api/incidents/dist/

# Copy public static assets
COPY api/incidents/public ./api/incidents/public

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nestjs -u 1001
RUN chown -R nestjs:nodejs /app
USER nestjs

# Set default environment variables
ENV DATABASE_ENABLED=false

# Set working directory to the app location
WORKDIR /app/api/incidents

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["node", "dist/src/main.js"]
