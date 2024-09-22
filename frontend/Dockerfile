FROM node:18-alpine as base

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile  # Instalar dependências de produção e desenvolvimento

COPY . .

EXPOSE 5173

CMD ["yarn", "dev"]
