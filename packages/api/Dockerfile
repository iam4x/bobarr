FROM node:14-alpine

RUN apk add curl

ENV PORT 4000
EXPOSE 4000

WORKDIR /usr/src/app
COPY package*.json yarn.lock ./

RUN yarn --network-timeout 1000000
COPY . .

RUN yarn build

HEALTHCHECK --start-period=30s \
  CMD curl -s -f http://localhost:4000/health || exit 1

CMD yarn start:prod
