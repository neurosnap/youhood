PORT="5432"
PGHOST="localhost"
PGUSER="postgres"
PGDATABASE="postgres"
BIN="./node_modules/.bin"

dev:
	$(BIN)/webpack --watch

prod:
	$(BIN)/webpack

psql-setup:
	docker network create youhood-network

psql-build:
	docker build -t neurosnap/youhood .

psql-run:
	docker run --name youhood -p $(PORT):$(PORT) -e POSTGRES_PASSWORD=$(PGPASSWORD) \
		--network youhood-network -d neurosnap/youhood

psql-provision:
	docker run \
		-it \
		--network youhood-network \
		--rm \
		-v $(shell pwd)/sql:/opt \
		-e PGPASSWORD=$(PGPASSWORD) \
		neurosnap/youhood \
		bash -c 'psql -h 172.18.0.2 -d $(PGDATABASE) -U $(PGUSER) < /opt/setup.sql'

psql-destroy:
	docker run \
		-it \
		--rm \
		--network youhood-network \
		-v $(shell pwd)/sql:/opt \
		-e PGPASSWORD=$(PGPASSWORD) \
		neurosnap/youhood \
		bash -c 'psql -h 172.18.0.2 -d $(PGDATABASE) -U $(PGUSER) < /opt/teardown.sql'

psql:
	docker run \
		-it \
		--rm \
		--network youhood-network \
		-v $(shell pwd)/sql:/opt \
		-e PGPASSWORD=$(PGPASSWORD) \
		neurosnap/youhood \
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
	GOOGLE_CLIENT_ID="708253278100-r0qmuh32tobh9g282to4c9vnve1bue6p.apps.googleusercontent.com" \
	GOOGLE_CLIENT_SECRET="4zjGaLMNkn3IEvxZz8Y5A8Ak" \
	node ./src/delivery/server/index.js
