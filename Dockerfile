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

# Enable corepack
RUN chmod 644 .env && corepack enable

# Build
RUN yarn && yarn build

# Run
CMD [ "node", "./dist/index.js" ]
