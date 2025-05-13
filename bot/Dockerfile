FROM node:18

WORKDIR /usr/src/bot

COPY package*.json ./

RUN npm install discord.js axios dotenv

COPY . .

CMD ["node", "src/index.js"]