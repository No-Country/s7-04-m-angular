FROM node:18-alpine

#ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm ci

COPY . .

EXPOSE 3000

RUN npm run build

CMD ["npm", "start"]