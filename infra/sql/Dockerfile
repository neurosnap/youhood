FROM mdillon/postgis:10
RUN mkdir -p /var/lib/postgresql/data
ADD ./infra/sql/setup.sql /docker-entrypoint-initdb.d/setup.sql
