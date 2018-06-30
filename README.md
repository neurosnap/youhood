YouHood [![Build Status](https://travis-ci.org/neurosnap/youhood.svg?branch=master)](https://travis-ci.org/neurosnap/youhood)
=======

Crowd sourced neighborhood boundary site

## Requirements

* node
* docker

## Dev

### Required Environment Variables

* `PGPASSWORD` # password for postgresql

```bash
yarn
docker-compose up
docker logs # terminal 1
make dev # terminal 2
make server #  terminal 3
make psql # terminal 4
```

## Deploy

* Create EC2 instance

### Required Environment Variables

* `SERVER` # server address
* `EC2_USER` # name of the user
* `PROD_DIR` # production directory

```bash
make setup
```

Once changes have been made and we want to publish changes

```bash
make deploy
```

Production logs

```bash
make logs
```

SSH into instance

```bash
make ssh
```
