#!/bin/bash
set -x

echo $PGPASSWORD
echo $BRANCH

cd /srv/youhood
git remote update
git reset --hard origin/$BRANCH
mkdir -p data

docker-compose -f production.yml pull --ignore-pull-failures
docker-compose -f production.yml build
docker-compose -f production.yml up -d
