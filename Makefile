PORT="5432"
PGHOST="db"
PGUSER="postgres"
PGDATABASE="postgres"
BIN=./node_modules/.bin

.PHONY: server dev prod lint circular tsc test open

dev:
	$(BIN)/webpack --config "webpack/dev.js" --watch

prod:
	$(BIN)/webpack --config "webpack/prod.js"

lint:
	$(BIN)/tslint './packages/**/*.ts' './web/**/*.ts'

tsc:
	$(BIN)/tsc --noEmit

test: tsc lint

open:
	open http://localhost:8080/index

psql-setup:
	docker network create youhood-network

psql-build:
	docker build -t neurosnap/youhood .

psql-run:
	docker run --name youhood -p $(PORT):$(PORT) -e POSTGRES_PASSWORD=$(PGPASSWORD) \
		--network youhood-network -d mdillon/postgis:10

psql-provision:
	docker run \
		-it \
		--network youhood-network \
		--rm \
		-v $(shell pwd)/sql:/opt \
		-e PGPASSWORD=$(PGPASSWORD) \
		mdillon/postgis:10 \
		bash -c 'psql -h 172.18.0.2 -d $(PGDATABASE) -U $(PGUSER) < /opt/setup.sql'

psql-destroy:
	docker run \
		-it \
		--rm \
		--network youhood-network \
		-v $(shell pwd)/sql:/opt \
		-e PGPASSWORD=$(PGPASSWORD) \
		mdillon/postgis:10 \
		bash -c 'psql -h 172.18.0.2 -d $(PGDATABASE) -U $(PGUSER) < /opt/teardown.sql'

psql:
	docker run \
		-it \
		--rm \
		--network youhood-network \
		-v $(shell pwd)/sql:/opt \
		-e PGPASSWORD=$(PGPASSWORD) \
		mdillon/postgis:10 \
		bash -c 'psql -h 172.18.0.2 -d $(PGDATABASE) -U $(PGUSER)'

psql-rm:
	docker stop youhood
	docker rm youhood

server:
	DEBUG="*" \
	PGHOST=$(PGHOST) \
	PGUSER=$(PGUSER) \
	PGDATABASE=$(PGDATABASE) \
	PGPASSWORD="$(PGPASSWORD)" \
	PGPORT=$(PORT) \
	node ./server/index.js
