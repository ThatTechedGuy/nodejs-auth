# stage 1 building the code
FROM node:13.12.0


RUN mkdir -p /usr/src/auth
WORKDIR /usr/src/auth


ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json /usr/src/auth
RUN npm install --production
COPY . .
RUN npm run clean
RUN npm run build