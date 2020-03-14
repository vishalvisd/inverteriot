FROM node:10.15.0-alpine

RUN apk add --no-cache bash

RUN apk add --no-cache git

RUN apk add --no-cache curl

WORKDIR /usr/workspace

COPY package*.json ./

RUN /bin/bash -c 'npm ci --verbose'

COPY . ./

CMD ["npm", "start"]

EXPOSE 3000
LABEL Name="Inverter IOT Frontend" \
    VERSION="1.0.0"
