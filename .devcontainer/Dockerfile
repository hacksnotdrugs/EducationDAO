# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.202.5/containers/ubuntu/.devcontainer/base.Dockerfile

# [Choice] Ubuntu version (use hirsuite or bionic on local arm64/Apple Silicon): hirsute, focal, bionic
ARG VARIANT="hirsute"
FROM mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

# Update all Ubuntu Packages
RUN apt update && apt upgrade -y

# Install curl
RUN apt install curl

# Install node.js
RUN curl -fsSL https://deb.nodesource.com/setup_14.x | sudo -E bash -
RUN apt install -y nodejs
RUN apt install -y python
RUN apt install -y make
RUN apt install -y g++

#Install Hardhat
#RUN npm install --save-dev hardhat

#Install 




#Install OpenZeppelin
RUN npm install -g @openzeppelin/contracts@4.5.0
RUN npm install -g @openzeppelin/test-helpers@0.5.15

# Install Truffle Suite
#RUN npm install -g truffle@5.2.4



# Install Ganache
# TODO: Upgrade to ganache v7 when this issue is addressed
# https://github.com/trufflesuite/ganache/issues/2489
#RUN npm install -g ganache-cli@6.12.2