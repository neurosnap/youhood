YouHood [![Build Status](https://travis-ci.org/neurosnap/youhood.svg?branch=master)](https://travis-ci.org/neurosnap/youhood)
=======

Crowd sourced neighborhood boundary site

## Requirements

* node
* docker

## Dev

### Required Environment Variables

* `PGPASSWORD` # password for postgresql
* `GOOGLE_API_KEY` # required for geolookup of neighborhoods as well as searching for a location
* `SENDGRID_API_KEY` # required for sending emails

```bash
yarn
docker-compose up
docker logs # terminal 1
make dev # terminal 2
make server #  terminal 3
make psql # terminal 4
```

## Local Deploy

All of our servers are built using Google Cloud Build and stored using Google Storage.
So in order for this deploy to work, the latest images must be pushed to Google Storage.

First we need to download the docker machine cert from google storage

```
gsutil cp gs://youhood/youhood-1.zip youhood-1.zip
```

Then we load the cert

```
yarn global add machine-share
machine-import youhood-1.zip
```

Then we deploy

```
eval $(docker-machine env youhood-1)
docker-compose -f production.yml up --no-deps -d
```

## Wipe db

```
eval $(docker-machine env youhood-1)
docker-compose -f production.yml down -v
docker-compose -f production.yml up --no-deps -d
```
