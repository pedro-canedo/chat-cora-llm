FROM node:18-alpine as base

# Definir o diretório de trabalho dentro do contêiner
WORKDIR /usr/src/app

# Copiar apenas os arquivos necessários para instalar dependências (cache eficiente)
COPY package.json yarn.lock ./

# Instalar dependências, incluindo dependências de desenvolvimento
RUN yarn install --frozen-lockfile

# Copiar o restante dos arquivos do projeto
COPY . .

# Expor a porta em que o Vite estará rodando
EXPOSE 5173

# Definir o comando padrão para rodar o servidor de desenvolvimento
CMD ["yarn", "dev"]
