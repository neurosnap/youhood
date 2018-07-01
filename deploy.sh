#!/bin/bash
set -x

git reset --hard origin/$BRANCH

docker-compose -f production.yml pull --ignore-pull-failures
docker-compose -f production.yml build
docker-compose -f production.yml up -d
