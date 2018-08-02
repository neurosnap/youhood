# DEV
BIN=./node_modules/.bin
PGDATABASE?="postgres"
PGHOST?="db"
PGUSER?="postgres"
PORT?="5432"
# PROD
SERVER?=35.231.217.200
BRANCH?=master
PROJECT_ID?=youhood-192019
DOCKER_MACHINE?=youhood-1

prettier:
	$(BIN)/prettier --write "{packages,server/web}/**/*.{js,ts}"

dev:
	$(BIN)/webpack-dev-server --hot --config "webpack/dev.js"
.PHONY: dev

prod:
	$(BIN)/webpack --config "webpack/prod.js"
.PHONY: prod

server:
	DEBUG="*" \
	PGHOST=$(PGHOST) \
	PGUSER=$(PGUSER) \
	PGDATABASE=$(PGDATABASE) \
	PGPASSWORD="$(PGPASSWORD)" \
	PGPORT=$(PORT) \
	PORT=8080 \
	node ./server/index.js
.PHONY: server

psql:
	docker exec -it youhood_db_1 psql -U $(PGUSER)
.PHONY: psql

lint:
	$(BIN)/tslint './packages/**/*.ts' './web/**/*.ts'
.PHONY: lint

tsc:
	$(BIN)/tsc --noEmit
.PHONY: tsc

jest:
	$(BIN)/jest $(JEST_FILES)
.PHONY: jest

jest-watch:
	$(BIN)/jest --watch $(JEST_FILES)
.PHONY: jest-watch

jest-update:
	$(BIN)/jest -u
.PHONY: jest-update

test: tsc lint jest
.PHONY: test

open:
	open http://localhost:8080/index
.PHONY: open

setup: provision
.PHONY: setup

init:
	gcloud auth configure-docker
.PHONY: init

provision:
	docker-machine create \
		--driver google \
		--google-project $(PROJECT_ID) \
		--google-machine-type f1-micro \
		--google-address $(SERVER) \
		--google-zone us-east1-b \
		--google-tags http-server,https-server \
		--google-scopes https://www.googleapis.com/auth/devstorage.read_write,https://www.googleapis.com/auth/logging.write \
		--google-username docker-user \
		$(DOCKER_MACHINE)
	docker-machine ssh $(DOCKER_MACHINE) 'bash -s' < ./infra/provision.sh
	$(BIN)/machine-export $(DOCKER_MACHINE)
	gsutil cp $(DOCKER_MACHINE).zip gs://youhood
.PHONY: provision

deploy:
	# BE SURE TO SET CORRECT DOCKER ENVIRONMENT
	# eval (docker-machine env youhood-1)
	docker-compose -f production.yml pull --ignore-pull-failures
	docker-compose -f production.yml up --no-deps -d
.PHONY: deploy

logs:
	docker-compose -f production.yml logs -f --tail="100"'
.PHONY: logs

ssh:
	docker-machine ssh $(DOCKER_MACHINE)
.PHONY: ssh
