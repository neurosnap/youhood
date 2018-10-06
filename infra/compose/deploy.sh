#!/bin/bash
docker-compose -f production.yml pull
docker-compose -f production.yml up --build -d
docker system prune -a
