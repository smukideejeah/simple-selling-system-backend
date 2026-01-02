FROM node:24.11.1-alpine
WORKDIR /app
COPY . .
RUN npm i
RUN npm run build
RUN chmod +x ./init.sh
CMD [ "npm", "start" ]
