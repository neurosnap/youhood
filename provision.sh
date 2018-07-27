#!/bin/bash
set -x

# create data folder for db
mkdir -p data

# Add user to docker group
sudo usermod -aG docker $(whoami)

########################
# INSTALL DOCKER-COMPOSE
########################

echo "Installing docker-compose..."
sudo curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
