PORT="5432"
PGHOST?="db"
PGUSER="postgres"
PGDATABASE="postgres"
BIN=./node_modules/.bin
BRANCH?="master"
EC2_USER?=ubuntu
SERVER?=youhood.io
PROD_DIR?=/srv/youhood

dev:
	$(BIN)/webpack --config "webpack/dev.js" --watch
.PHONY: dev

prod:
	$(BIN)/webpack --config "webpack/prod.js"
.PHONY: prod

lint:
	$(BIN)/tslint './packages/**/*.ts' './web/**/*.ts'
.PHONY: lint

tsc:
	$(BIN)/tsc --noEmit
.PHONY: tsc

jest:
	$(BIN)/jest $(JEST_FILES)
.PHONY: jest

jest-update:
	$(BIN)/jest -u
.PHONY: jest-update

test: tsc lint jest
.PHONY: test

open:
	open http://localhost:8080/index
.PHONY: open

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

setup: permissions copy provision start
.PHONY: setup

permissions:
	ssh $(EC2_USER)@$(SERVER) 'sudo chown $(EC2_USER):ubuntu $(PROD_DIR)'
.PHONY: permissions

copy:
	rsync -rav -e ssh --exclude='.git/' . $(EC2_USER)@$(SERVER):$(PROD_DIR)
.PHONY: copy

provision:
	ssh $(EC2_USER)@$(SERVER) 'bash -s' < provision.sh
.PHONY: provision

start:
	ssh $(EC2_USER)@$(SERVER) 'BRANCH=$(BRANCH) PGPASSWORD=$(PGPASSWORD) bash -s' < ./deploy.sh
.PHONY: start

deploy: copy start
.PHONY: deploy

logs:
	ssh $(EC2_USER)@$(SERVER) 'cd $(PROD_DIR) && docker-compose logs -f --tail="100"'
.PHONY: logs

ssh:
	ssh $(EC2_USER)@$(SERVER)
.PHONY: ssh
