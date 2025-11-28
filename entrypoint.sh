#!/bin/sh

# 1. Handle .env generation
if [ ! -f .env ]; then
    echo "No .env found. Copying .env.example..."
    cp .env.example .env
fi

# 2. Run Database Migrations
# We use 'pnpm exec' to ensure we use the installed version in node_modules
echo "Running database migrations..."
pnpm exec drizzle-kit migrate

# 3. Start the application
echo "Starting application..."
# We explicitly run the node build.
# If this fails, it means 'adapter-node' is not set up correctly.
node build/index.js