FROM ghcr.io/astral-sh/uv:python3.10-alpine

# Copy the project into the image
ADD . /app

# Install Rust before syncing the project
RUN apk add --no-cache rust cargo

# Sync the project into a new environment, using the frozen lockfile
WORKDIR /app
RUN uv sync --frozen

EXPOSE 8000

# Run the application
CMD ["uv", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]