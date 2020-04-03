FROM node:12-alpine
RUN apk add --no-cache libc6-compat

ENV PORT 4000
EXPOSE 4000

WORKDIR /usr/src/app
COPY package*.json ./

RUN yarn
COPY . .

CMD yarn start
