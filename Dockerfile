FROM node:18.16.1-alpine3.17 as base

WORKDIR /usr/src/app
COPY package*.json .
RUN npm install
COPY . .
CMD [ "npm", "run", "dev"]