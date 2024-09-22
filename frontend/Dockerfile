FROM node:18-alpine as base

WORKDIR /usr/src/app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

# Expor a porta 3000, que será usada pela aplicação
EXPOSE 3000

# Definir o comando padrão para rodar o servidor de desenvolvimento
CMD ["yarn", "dev"]
