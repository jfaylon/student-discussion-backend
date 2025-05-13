FROM node:22

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Copy env file into image as .env
ARG ENV=docker
COPY .env.${ENV} .env

# Optional: if you use dotenv in your code, this makes .env available
ENV NODE_ENV=production

RUN npm run build

EXPOSE 8000
CMD ["node", "dist/index.js"]