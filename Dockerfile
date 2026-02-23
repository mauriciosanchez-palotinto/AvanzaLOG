FROM node:18-alpine AS build

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY . .
RUN npm run prisma:generate
RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install --legacy-peer-deps

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules/.prisma ./.prisma
COPY prisma ./prisma

RUN npm run prisma:generate

RUN npm install --legacy-peer-deps --omit=dev && npm cache clean --force

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
