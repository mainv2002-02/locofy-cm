FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

CMD ["sh", "-c", "npm run tsc && npm run start"]
