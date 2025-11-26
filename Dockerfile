FROM node:25-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

FROM base AS dev
EXPOSE 5173
# We set the cache to a writable location so pnpm doesn't crash when running as a non-root user
ENV XDG_CACHE_HOME=/tmp/.pnpm-cache
CMD ["/bin/sh", "-c", "pnpm install && pnpm run dev"]

FROM base AS build
# Required for pnpm prune to work
ENV CI=true
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
# Remove devDependencies to keep the image small
RUN pnpm prune --prod

FROM base AS prod
ENV NODE_ENV=production
# Create the data directory so permissions are correct
RUN mkdir -p /app/data
# Copy the built app from the build stage
COPY --from=build /app/build ./build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./package.json

EXPOSE 3000
CMD ["node", "build/index.js"]