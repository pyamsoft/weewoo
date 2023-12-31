FROM node:18-slim

WORKDIR /weewoo

RUN umask 0022

COPY package.json ./
COPY tsconfig.json ./
COPY yarn.lock ./
COPY .yarnrc.yml ./
COPY .eslintrc.cjs ./
COPY .env ./.env
COPY src ./src

RUN chmod 644 .env && yarn && yarn build

CMD [ "node", "./dist/index.js" ]
