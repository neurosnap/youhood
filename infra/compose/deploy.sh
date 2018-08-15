#!/bin/bash
docker-compose -f production.yml pull
docker-compose -f production.yml --build -d
