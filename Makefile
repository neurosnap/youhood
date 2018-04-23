PORT="5432"
PGHOST?="db"
PGUSER="postgres"
PGDATABASE="postgres"
BIN=./node_modules/.bin
BRANCH?="master"

.PHONY: server dev prod lint circular tsc test open

dev:
	$(BIN)/webpack --config "webpack/dev.js" --watch

prod:
	$(BIN)/webpack --config "webpack/prod.js"

lint:
	$(BIN)/tslint './packages/**/*.ts' './web/**/*.ts'

tsc:
	$(BIN)/tsc --noEmit

jest:
	$(BIN)/jest $(JEST_FILES)

jest-update:
	$(BIN)/jest -u

test: tsc lint jest

open:
	open http://localhost:8080/index

server:
	DEBUG="*" \
	PGHOST=$(PGHOST) \
	PGUSER=$(PGUSER) \
	PGDATABASE=$(PGDATABASE) \
	PGPASSWORD="$(PGPASSWORD)" \
	PGPORT=$(PORT) \
	node ./server/index.js

deploy:
	ssh ubuntu@youhood.io 'BRANCH=$(BRANCH) PGPASSWORD=$(PGPASSWORD) bash -s' < ./deploy.sh

psql:
	docker exec -it youhood_db_1 psql -U $(PGUSER)
