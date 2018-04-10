#!/bin/bash
set -x

echo $PGPASSWORD
echo $BRANCH

cd /srv/youhood
git remote update
git reset --hard origin/$BRANCH
mkdir -p data

docker-compose pull --ignore-pull-failures
docker-compose build
docker-compose up -d