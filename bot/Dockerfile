FROM node:18-alpine
WORKDIR /usr/src/bot

RUN npm install discord.js
RUN npm install axios

COPY . .

CMD ["node", "src/index.js"]