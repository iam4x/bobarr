FROM node:12-alpine

ENV PORT 4000
EXPOSE 4000

WORKDIR /usr/src/app
COPY package*.json ./

RUN yarn
COPY . .

RUN yarn build

HEALTHCHECK --start-period=30s \
  CMD curl -f http://localhost:4000/health || exit 1

CMD yarn start:prod
