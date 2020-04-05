FROM node:12

ENV PORT 3000
EXPOSE 3000

WORKDIR /usr/src/app
COPY package*.json ./

RUN yarn
COPY . .

RUN yarn build
CMD yarn start
