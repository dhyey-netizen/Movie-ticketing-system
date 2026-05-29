FROM node:24-alpine3.21

WORKDIR /usr/src/app

COPY package.*json ./

RUN npm install 

COPY . .

EXPOSE 8000

CMD ["node", "app.js"]