# DEV
BIN=./node_modules/.bin
PGDATABASE?="postgres"
PGHOST?="db"
PGUSER?="postgres"
PORT?="5432"
# PROD
PROD_DIR?=/srv/youhood
SERVER?=youhood.io
BRANCH?=master

prettier:
	$(BIN)/prettier --write "{packages,server/web}/**/*.{js,ts}"

dev:
	$(BIN)/webpack --config "webpack/dev.js" --watch
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

setup: permissions provision start
.PHONY: setup

permissions:
	ssh $(EC2_USER)@$(SERVER) 'sudo chown $(EC2_USER):ubuntu $(PROD_DIR)'
.PHONY: permissions

provision:
	ssh $(EC2_USER)@$(SERVER) 'cd $(PROD_DIR) && bash -s' < provision.sh
.PHONY: provision

start:
	ssh $(EC2_USER)@$(SERVER) 'cd $(PROD_DIR) && BRANCH=$(BRANCH) PGPASSWORD=$(PGPASSWORD) bash -s' < ./deploy.sh
.PHONY: start

deploy: start
.PHONY: deploy

logs:
	ssh $(EC2_USER)@$(SERVER) 'cd $(PROD_DIR) && docker-compose logs -f --tail="100"'
.PHONY: logs

ssh:
	ssh $(EC2_USER)@$(SERVER)
.PHONY: ssh
