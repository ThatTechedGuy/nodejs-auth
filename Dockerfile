# stage 1 building the code
FROM node:13.12.0

RUN mkdir -p /usr/src/auth
WORKDIR /usr/src/auth

COPY package.json /usr/src/auth
RUN npm install
COPY . .