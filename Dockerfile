FROM node:24.11.1-alpine

WORKDIR /app

COPY package*.json .
RUN npm ci

COPY prisma ./prisma
RUN npm run db:g

COPY . .

RUN npm run build

CMD [ "npm", "start" ]
