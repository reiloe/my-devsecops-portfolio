---
title: 🐳 Docker Commands
sidebar_label: Docker
sidebar_position: 2
tags: [docker, containers, containerization, cheat-sheet]
---

# 🐳 Docker Commands Cheat Sheet

## Docker Basics

```bash
# Docker version
docker --version
docker version
docker info

# Pull images
docker pull IMAGE                  # Pull latest
docker pull IMAGE:TAG              # Pull specific tag
docker pull nginx:latest

# List images
docker images                      # List all images
docker images -a                   # All images including intermediate
docker image ls

# Remove images
docker rmi IMAGE                   # Remove image
docker rmi IMAGE:TAG
docker image prune                 # Remove unused images
docker image prune -a              # Remove all unused images
```

## Container Management

```bash
# Run container
docker run IMAGE                      # Run and exit
docker run -d IMAGE                   # Detached mode
docker run -it IMAGE                  # Interactive mode
docker run --name NAME IMAGE          # Named container
docker run -p 8080:80 IMAGE           # Port mapping
docker run -v /host:/container IMAGE  # Volume mount
docker run -e VAR=value IMAGE         # Environment variable
docker run --rm IMAGE                 # Auto-remove after exit

# List containers
docker ps                          # Running containers
docker ps -a                       # All containers
docker container ls

# Container operations
docker start CONTAINER             # Start container
docker stop CONTAINER              # Stop container
docker restart CONTAINER           # Restart container
docker pause CONTAINER             # Pause container
docker unpause CONTAINER           # Unpause container
docker kill CONTAINER              # Force stop

# Remove containers
docker rm CONTAINER                # Remove container
docker rm -f CONTAINER             # Force remove
docker container prune             # Remove stopped containers

# Container logs
docker logs CONTAINER              # View logs
docker logs -f CONTAINER           # Follow logs
docker logs --tail 100 CONTAINER   # Last 100 lines

# Execute in container
docker exec CONTAINER COMMAND      # Run command
docker exec -it CONTAINER bash     # Interactive shell
docker exec -it CONTAINER sh       # Shell (alpine)

# Container info
docker inspect CONTAINER           # Detailed info
docker stats                       # Resource usage
docker top CONTAINER               # Running processes
```

## Docker Images

```bash
# Build image
docker build -t IMAGE:TAG .                    # Build from Dockerfile
docker build -f Dockerfile.dev -t IMAGE:TAG .  # Custom Dockerfile

# Tag image
docker tag IMAGE:TAG REPO:TAG      # Tag image

# Push image
docker login                       # Login to registry
docker push IMAGE:TAG              # Push to registry

# Save/load images
docker save IMAGE -o image.tar     # Save to tar
docker load -i image.tar           # Load from tar

# Export/import containers
docker export CONTAINER -o container.tar  # Export container
docker import container.tar IMAGE:TAG     # Import as image
```

## Docker Compose

```bash
# Start services
docker-compose up                  # Start all services
docker-compose up -d               # Detached mode
docker-compose up --build          # Rebuild images

# Stop services
docker-compose down                # Stop and remove
docker-compose down -v             # Remove volumes too
docker-compose stop                # Stop services

# View services
docker-compose ps                  # List services
docker-compose logs                # View logs
docker-compose logs -f SERVICE     # Follow service logs

# Execute commands
docker-compose exec SERVICE COMMAND  # Run in service
docker-compose run SERVICE COMMAND   # Run one-off command

# Other operations
docker-compose build               # Build services
docker-compose restart             # Restart services
docker-compose pull                # Pull images
```

## Docker Networks

```bash
# List networks
docker network ls

# Create network
docker network create NETWORK

# Connect container
docker network connect NETWORK CONTAINER

# Disconnect container
docker network disconnect NETWORK CONTAINER

# Inspect network
docker network inspect NETWORK

# Remove network
docker network rm NETWORK
```

## Docker Volumes

```bash
# List volumes
docker volume ls

# Create volume
docker volume create VOLUME

# Inspect volume
docker volume inspect VOLUME

# Remove volume
docker volume rm VOLUME

# Remove unused volumes
docker volume prune
```
