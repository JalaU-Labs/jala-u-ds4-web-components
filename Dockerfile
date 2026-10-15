# syntax=docker/dockerfile:1

FROM node:26-alpine

# Runtime dependencies for the Makefile and general development.
# Alpine does not ship make, bash, or git by default.
RUN apk add --no-cache \
    make \
    bash \
    git

WORKDIR /app

# Copy manifests first so dependency installation is cached independently
# from source changes.
COPY package.json package-lock.json ./

# Reproducible install from the lockfile.
RUN npm ci

# Copy the rest of the project.
COPY . .

# Default command: run the full CI pipeline inside the container.
# Override with `docker run --rm <image> <command>` for a single task.
CMD ["make", "ci"]