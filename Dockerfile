FROM node:18.16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install @tensorflow/tfjs-node@3.21.1
COPY . .

# Buat direktori credentials dan set permissions
RUN mkdir -p /usr/src/app/credentials
COPY bucket_service_key.json /usr/src/app/credentials/
ENV GOOGLE_APPLICATION_CREDENTIALS=/usr/src/app/credentials/bucket_service_key.json

EXPOSE 8080
CMD ["node", "src/server/server.js"]