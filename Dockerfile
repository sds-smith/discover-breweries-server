FROM node:lts-alpine

WORKDIR /

COPY package*.json ./
RUN npm install --omit=dev

COPY ./ ./

USER node

CMD ["npm", "start"]

EXPOSE 80