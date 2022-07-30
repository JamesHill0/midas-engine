deploy-midas-backend:
	cd deployments/backend && docker-compose build
	cd deployments/backend && docker-compose up -d

deploy-midas-frontend:
	cd deployments/frontend && docker-compose build
	cd deployments/frontend && docker-compose up -d

deploy-all: deploy-midas-backend deploy-midas-frontend
