FROM node:19 AS base

WORKDIR /var/www/app

RUN npm i npm@latest -g

RUN mkdir -p /var/www/app

COPY package*.json ./

RUN npm ci && npm cache clean --force

COPY . .

EXPOSE 8080

CMD ["npm", "start"]