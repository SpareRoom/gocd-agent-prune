FROM node:8.11-alpine

WORKDIR /usr/gocd-prune-agents

COPY package.json package-lock.json ./

RUN npm i --production

COPY lib/ lib/

COPY index.js ./

ENV NO_DEPRECATION=*

ENTRYPOINT ["node", "."]
