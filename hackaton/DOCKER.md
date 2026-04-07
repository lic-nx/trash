# WikiLive Docker Documentation

## Overview

WikiLive is fully containerized with Docker for easy deployment and development.

## Quick Start with Docker

### Development
```bash
# Build and run all services
docker-compose up --build

# Or in background
docker-compose up -d
```

Access at:
- Frontend: http://localhost:3000
- Backend: http://localhost:3001
- Mock API: http://localhost:3002

### Production
```bash
# Build production image
docker build -t wikilive:latest .

# Run with docker-compose
docker-compose -f docker-compose.prod.yml up -d
```

## Docker Commands

### Build
```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build frontend

# Build without cache
docker-compose build --no-cache
```

### Run
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Logs
```bash
# View all logs
docker-compose logs

# Follow logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f frontend
```

### Shell Access
```bash
# Access frontend container
docker-compose exec frontend sh

# Access backend container
docker-compose exec backend sh
```

## Dockerfile Structure

### Multi-Stage Build

1. **frontend-builder** - Builds React frontend
2. **backend-builder** - Prepares Node.js backend
3. **mock-api-builder** - Sets up mock API
4. **production** - Combines all into minimal image

### Benefits
- Smaller final image size
- No development dependencies in production
- Faster builds with layer caching
- Better security (non-root user)

## Environment Variables

### Frontend
```env
VITE_API_URL=http://localhost:3001
VITE_SOCKET_URL=http://localhost:3001
```

### Backend
```env
PORT=3001
MOCK_API_URL=http://localhost:3002
CORS_ORIGIN=http://localhost:3000
NODE_ENV=production
```

### Mock API
```env
PORT=3002
NODE_ENV=production
```

## Health Checks

The production Dockerfile includes health checks:
- Checks frontend availability every 30 seconds
- Times out after 3 seconds
- Retries 3 times before marking unhealthy

## Networking

All services are on the `wikilive-network` bridge network:
- Services can communicate by service name
- Ports are exposed to host
- Isolated from other Docker networks

## Volume Mounts (Development)

Development docker-compose mounts:
- `./frontend:/app/frontend` - Live code reloading
- `./backend:/app/backend` - Live code reloading
- `./mock-api:/app/mock-api` - Live code reloading

Node modules are excluded to use container dependencies.

## Production Deployment

### Docker Hub
```bash
# Tag image
docker tag wikilive:latest yourusername/wikilive:1.0.0

# Push to registry
docker push yourusername/wikilive:1.0.0
```

### Kubernetes Ready
The Docker setup is Kubernetes-ready:
- Health checks configured
- Environment variables externalized
- Stateless design
- Proper port exposure

### Cloud Deployment

**AWS ECS:**
```bash
aws ecs create-service --cluster wikilive --service-name wikilive
```

**Google Cloud Run:**
```bash
gcloud run deploy wikilive --image gcr.io/project/wikilive
```

**Azure Container Instances:**
```bash
az container create --resource-group wikilive --name wikilive --image wikilive:latest
```

## Troubleshooting

### Port Already in Use
```bash
# Check what's using the port
lsof -i :3000

# Stop the process
kill -9 <PID>
```

### Container Won't Start
```bash
# Check logs
docker-compose logs frontend

# Rebuild
docker-compose build --no-cache frontend
```

### Network Issues
```bash
# Inspect network
docker network inspect wikilive-network

# Recreate network
docker-compose down
docker network rm wikilive-network
docker-compose up
```

### Disk Space
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove all unused resources
docker system prune -a
```

## Performance Optimization

### Build Cache
```bash
# Use build cache
docker build --cache-from wikilive:latest -t wikilive:latest .
```

### Multi-Architecture
```bash
# Build for multiple architectures
docker buildx build --platform linux/amd64,linux/arm64 -t wikilive:latest .
```

## Security Best Practices

1. **Non-root user** - Container runs as `nextjs` user
2. **Minimal image** - Alpine-based for smaller attack surface
3. **No secrets in image** - Use environment variables
4. **Health checks** - Automatic monitoring
5. **Read-only filesystem** - Consider for production

## Monitoring

### Docker Stats
```bash
# View resource usage
docker stats
```

### Logs
```bash
# Stream logs to file
docker-compose logs -f > wikilive.log

# JSON logs for parsing
docker logs --details frontend
```

## Next Steps

1. Add CI/CD pipeline with Docker
2. Set up container registry
3. Configure orchestration (Kubernetes/Swarm)
4. Implement monitoring (Prometheus/Grafana)
5. Add logging aggregation (ELK stack)

---

**Happy Docking! 🐳**
