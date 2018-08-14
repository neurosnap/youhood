FROM node:9.11.2-slim

RUN curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
RUN chmod +x /usr/local/bin/docker-compose
RUN docker-compose --version

ADD youhood-1.zip /srv
ADD production.yml /srv
WORKDIR /srv

RUN yarn global add machine-share
RUN machine-import youhood-1.zip

ENV DOCKER_TLS_VERIFY="1"
ENV DOCKER_HOST="tcp://35.231.217.200:2376"
ENV DOCKER_CERT_PATH="/root/.docker/machine/machines/youhood-1"
ENV DOCKER_MACHINE_NAME="youhood-1"
ENV COMPOSE_PROJECT_NAME="youhood"

CMD ["docker-compose", "-f", "production.yml", "up", "--build", "-d"]
