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
	$(BIN)/prettier --write "{packages,server,web}/**/*.{js,ts}"

dev:
	$(BIN)/webpack-dev-server --config "webpack/dev.js"
.PHONY: dev

stats:
	$(BIN)/webpack --profile --json --config "webpack/prod.js" > stats.json
.PHONY: stats

analyze:
	$(BIN)/webpack-bundle-analyzer stats.json
.PHONY: analyze

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
	GOOGLE_API_KEY=$(GOOGLE_API_KEY) \
	SENDGRID_API_KEY=$(SENDGRID_API_KEY) \
	node ./server/index.js
.PHONY: server

zillow:
	DEBUG="*" \
	PGHOST="localhost" \
	PGUSER=$(PGUSER) \
	PGDATABASE=$(PGDATABASE) \
	PGPASSWORD="$(PGPASSWORD)" \
	PGPORT=$(PORT) \
	$(BIN)/ts-node ./scripts/zillow.ts /Users/erock/Documents/zillow /Users/erock/Documents/zillow-geojson
.PHONY: zillow

server-dev:
	NODE_ENV="development" \
	DEBUG="*" \
	PGHOST=$(PGHOST) \
	PGUSER=$(PGUSER) \
	PGDATABASE=$(PGDATABASE) \
	PGPASSWORD="$(PGPASSWORD)" \
	PGPORT=$(PORT) \
	PORT=8080 \
	GOOGLE_API_KEY=$(GOOGLE_API_KEY) \
	SENDGRID_API_KEY=$(SENDGRID_API_KEY) \
	$(BIN)/nodemon ./server/index.js
.PHONY: server

psql:
	docker exec -it youhood_db_1 psql -U $(PGUSER)
.PHONY: psql

dump:
	docker exec -it youhood_db_1 pg_dump $(PGDATABASE) -U $(PGUSER) > ~/youhood_dump.sql
.PHONY: dump

restore:
	docker exec -i youhood_db_1 psql $(PGDATABASE) -U $(PGUSER) < ~/youhood_dump.sql
.PHONY: restore

migrate:
	docker exec -i youhood_db_1 psql -U $(PGUSER) -d $(PGDATABASE) < ./infra/sql/migrations/1-api_keys.sql
	docker exec -i youhood_db_1 psql -U $(PGUSER) -d $(PGDATABASE) < ./infra/sql/migrations/2-email_validation.sql
	docker exec -i youhood_db_1 psql -U $(PGUSER) -d $(PGDATABASE) < ./infra/sql/migrations/3-vote_to_int.sql
	docker exec -i youhood_db_1 psql -U $(PGUSER) -d $(PGDATABASE) < ./infra/sql/migrations/4-hood_indexes.sql
	docker exec -i youhood_db_1 psql -U $(PGUSER) -d $(PGDATABASE) < ./infra/sql/migrations/5-api_keys_add_label.sql
.PHONY: migrate

lint:
	$(BIN)/tslint './packages/**/*.ts' './web/**/*.ts'
.PHONY: lint

tsc:
	$(BIN)/tsc --noEmit
.PHONY: tsc

jest:
	TZ=America/New_York $(BIN)/jest $(JEST_FILES)
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

secret:
	curl -v "https://cloudkms.googleapis.com/v1/projects/$(PROJECT_ID)/locations/global/keyRings/$(KEYRING_NAME)/cryptoKeys/$(CRYPTOKEY_NAME):encrypt" \
	  -d "{\"plaintext\":\"$(PLAINTEXT)\"}" \
	  -H "Authorization:Bearer $(gcloud auth application-default print-access-token)"\
	  -H "Content-Type: application/json"
.PHONY: secret
