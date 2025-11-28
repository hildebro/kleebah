FROM node:20-alpine

WORKDIR /app

# 1. Install pnpm
RUN npm install -g pnpm

# 2. Copy manifest files first (for better caching)
COPY package.json pnpm-lock.yaml ./

# 3. Install ALL dependencies (including devDependencies)
# We need these so drizzle-kit can execute your TS config file
RUN pnpm install --frozen-lockfile

# 4. Copy the entire project source code
# (Excluding what's in .dockerignore)
COPY . .

# 5. Build the app
RUN pnpm build

# 6. Setup entrypoint
RUN chmod +x entrypoint.sh

# 7. Environment Setup
ENV HOST=0.0.0.0
ENV PORT=5173
EXPOSE 5173

ENTRYPOINT ["./entrypoint.sh"]