FROM node:18

COPY ./prisma /app/prisma

WORKDIR /app

RUN apt-get update && apt-get install -y libssl-dev

COPY package.json package-lock.json ./

RUN npm install

RUN npx prisma generate

ENV PRISMA_QUERY_ENGINE_BINARY=/app/node_modules/.prisma/client/query-engine-debian-openssl-3.0.x

COPY . ./

RUN npm run build

CMD ["node", "dist/src/index.js"]

EXPOSE 5000