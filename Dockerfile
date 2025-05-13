FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG ENV=docker
COPY .env.${ENV} .env

ENV NODE_ENV=production

RUN npm run build

EXPOSE 8000
CMD ["node", "dist/index.js"]