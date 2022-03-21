FROM bitnami/node:14.19.1
WORKDIR /home/node/kafka-js
COPY package*.json ./
RUN npm install
COPY ./src ./
ENTRYPOINT exec node index.js