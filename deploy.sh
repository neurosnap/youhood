#!/bin/bash
set -x

echo $PGPASSWORD
echo $BRANCH

cd /srv/youhood
git remote update
git reset --hard origin/$BRANCH
mkdir -p data

docker-compose pull -f production.yml --ignore-pull-failures
docker-compose build -f production.yml
docker-compose up -d -f production.yml
