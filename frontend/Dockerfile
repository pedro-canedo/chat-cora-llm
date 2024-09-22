FROM node:18-alpine as base

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install

COPY . .

EXPOSE 5173/tcp

CMD ["yarn", "dev"]
