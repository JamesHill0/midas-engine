upgrade:
	python3.8 -m pip install --upgrade pip

install:
	python3.8 -m pip install -r requirements.txt

run-sync:
	python3.8 sync.py

build:
	cd deployments/$(env) && docker-compose build $(app)

up:
	cd deployments/$(env) && docker-compose up -d $(app)

down:
	cd deployments/$(env) && docker-compose down $(app)

delete: down
	docker image prune -f

deploy:
	build up

refresh:
	delete deploy
