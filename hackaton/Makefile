.PHONY: all install build dev prod clean stop logs shell help

# Default target
all: install build dev

# Install dependencies
install:
	@echo "📦 Installing all dependencies..."
	npm run install:all
	@echo "✅ Installation complete!"

# Build Docker images
build:
	@echo "🔨 Building Docker images..."
	docker-compose build
	@echo "✅ Docker images built!"

# Start development environment
start dev:
	@echo "🚀 Starting development environment..."
	docker-compose up --build

# Start in detached mode (background)
start-bg:
	@echo "🚀 Starting services in background..."
	docker-compose up -d --build
	@echo "✅ Services running in background!"
	@echo "📱 Frontend: http://localhost:3000"
	@echo "🔌 Backend: http://localhost:3001"
	@echo "🎭 Mock API: http://localhost:3002"

# Start production environment
prod:
	@echo "🏭 Starting production environment..."
	docker-compose -f docker-compose.prod.yml up -d --build
	@echo "✅ Production environment started!"

# Stop all services
stop:
	@echo "🛑 Stopping all services..."
	docker-compose down
	@echo "✅ Services stopped!"

# Stop and remove volumes
clean:
	@echo "🧹 Cleaning up..."
	docker-compose down -v --rmi local
	@docker system prune -f
	@echo "✅ Cleanup complete!"

# View logs
logs:
	@echo "📋 Viewing logs (Ctrl+C to exit)..."
	docker-compose logs -f

# View specific service logs
logs-frontend:
	docker-compose logs -f frontend

logs-backend:
	docker-compose logs -f backend

logs-mock:
	docker-compose logs -f mock-api

# Shell access
shell-frontend:
	docker-compose exec frontend sh

shell-backend:
	docker-compose exec backend sh

shell-mock:
	docker-compose exec mock-api sh

# Quick restart
restart:
	@echo "🔄 Restarting all services..."
	docker-compose restart
	@echo "✅ Services restarted!"

# Rebuild from scratch
rebuild:
	@echo "🔨 Rebuilding from scratch..."
	docker-compose down
	docker-compose build --no-cache
	docker-compose up -d
	@echo "✅ Rebuild complete!"

# Health check
health:
	@echo "🏥 Checking service health..."
	@docker-compose ps
	@echo ""
	@echo "Testing frontend..."
	@curl -s -o /dev/null -w "Frontend: %{http_code}\n" http://localhost:3000 || echo "Frontend: Not responding"
	@echo "Testing backend..."
	@curl -s -o /dev/null -w "Backend: %{http_code}\n" http://localhost:3001 || echo "Backend: Not responding"
	@curl -s -o /dev/null -w "Mock API: %{http_code}\n" http://localhost:3002 || echo "Mock API: Not responding"

# Quick demo
demo: start-bg
	@echo "\n🎬 Demo ready!"
	@echo "📱 Open: http://localhost:3000"
	@echo "⏳ Waiting for services to start..."
	@sleep 5
	@echo "✅ Ready for demo!"

# Production deployment
deploy: prod
	@echo "\n🚀 Production deployed!"
	@echo "📱 Open: http://localhost:3000"

# Show status
status:
	@echo "📊 Service Status:"
	@docker-compose ps

# Show Docker resource usage
stats:
	@docker stats --no-stream

# Help
help:
	@echo "🎯 WikiLive Docker Makefile Commands"
	@echo ""
	@echo "📋 Available commands:"
	@echo "  make install       - Install all dependencies"
	@echo "  make build         - Build Docker images"
	@echo "  make dev           - Start development environment (foreground)"
	@echo "  make start-bg      - Start services in background"
	@echo "  make prod          - Start production environment"
	@echo "  make stop          - Stop all services"
	@echo "  make restart       - Restart all services"
	@echo "  make rebuild       - Rebuild from scratch"
	@echo "  make clean         - Stop and remove all containers/volumes"
	@echo "  make logs          - View all logs"
	@echo "  make logs-frontend - View frontend logs"
	@echo "  make logs-backend  - View backend logs"
	@echo "  make logs-mock     - View mock API logs"
	@echo "  make shell-frontend - Access frontend shell"
	@echo "  make shell-backend  - Access backend shell"
	@echo "  make shell-mock     - Access mock API shell"
	@echo "  make health        - Check service health"
	@echo "  make status        - Show service status"
	@echo "  make stats         - Show Docker resource usage"
	@echo "  make demo          - Quick demo setup"
	@echo "  make deploy        - Production deployment"
	@echo "  make help          - Show this help message"
	@echo ""
	@echo "🌐 Service URLs:"
	@echo "  Frontend:  http://localhost:3000"
	@echo "  Backend:   http://localhost:3001"
	@echo "  Mock API:  http://localhost:3002"
	@echo ""
