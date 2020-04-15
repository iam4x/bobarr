FROM node:12-alpine

ENV PORT 4000
EXPOSE 4000

WORKDIR /usr/src/app
COPY package*.json ./

RUN yarn
COPY . .

RUN yarn build
CMD yarn start:prod
