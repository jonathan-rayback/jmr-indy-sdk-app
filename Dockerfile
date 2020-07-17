FROM ubuntu:18.04

WORKDIR /root/app

# silent mode for apt-get package installation
ENV DEBIAN_FRONTEND=noninteractive

# dependencies
RUN apt-get update && \
    apt-get install -y \
      apt-utils \
      apt-transport-https \
      build-essential \
      software-properties-common \
      pkg-config \
      cmake \ 
      gnupg \
      less \
      curl \
      git \
      libssl-dev \
      libsqlite3-dev \
      libzmq3-dev \
      libncursesw5-dev \
      python3.7

# get indy-cli, libindy, libnullpay, and libvcx
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys CE7709D068DB5E88 && \
    add-apt-repository "deb https://repo.sovrin.org/sdk/deb bionic stable" && \
    apt-get update && \
    apt-get install -y \
      indy-cli \
      libindy \
      libnullpay \
      libvcx

# install node
RUN curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
    apt-get install -y nodejs

# install node sdk build dependency
RUN npm install -g node-gyp

# install package dependencies (including indy-sdk)
COPY package.json .
RUN npm install

CMD [ "/bin/bash" ]