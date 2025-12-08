FROM node:20-alpine AS backend

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

EXPOSE 8000
CMD ["npm", "run", "dev"]
