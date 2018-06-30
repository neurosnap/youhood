#!/bin/bash
set -x

mkdir -p data

################
# INSTALL DOCKER
################

echo "Installing docker ..."
sudo apt-get update
sudo apt-get install -y \
	apt-transport-http \
	ca-certificates \
	curl \
	software-properties-common

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo apt-key fingerprint 0EBFCD88
sudo add-apt-repository \
   "deb [arch=amd64] https://download.docker.com/linux/ubuntu \
   $(lsb_release -cs) \
   stable"

sudo apt-get update
sudo apt-get install -y docker-ce
sudo usermod -a -G docker ubuntu

########################
# INSTALL DOCKER-COMPOSE
########################

echo "Installing docker-compose..."
sudo curl -L https://github.com/docker/compose/releases/download/1.21.0/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version
