FROM node:12-alpine

ENV PORT 4000
EXPOSE 4000

WORKDIR /usr/src/app
COPY package*.json yarn.lock ./

RUN yarn 

COPY . .

RUN yarn build

HEALTHCHECK --interval=12s --timeout=12s --start-period=30s \  
 CMD node ./healthcheck.js

CMD yarn start:prod
