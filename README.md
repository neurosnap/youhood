YouHood [![Build Status](https://travis-ci.org/neurosnap/youhood.svg?branch=master)](https://travis-ci.org/neurosnap/youhood)
=======

Crowd sourced neighborhood boundary site

## Requirements

* node
* docker

## Dev

```bash
yarn
PGPASSWORD="<password>" docker-compose up
docker logs # terminal 1
make dev # terminal 2
PGPASSWORD="<password>" make server #  terminal 3
PGPASSWORD="<password>" make psql # terminal 4
```

## Deploy

* Create EC2 instance

```bash
SERVER=<ip_address> make setup
```

Once changes have been made and we want to publish changes

```bash
SERVER=<ip_address> make deploy
```

Production logs

```bash
SERVER=<ip_address> make logs
```

SSH into instance

```bash
SERVER=<ip_address> make ssh
```
