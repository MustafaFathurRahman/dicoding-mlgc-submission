# Menggunakan Node.js 18 sebagai base image
FROM node:18

# Set working directory di dalam container
WORKDIR /usr/src/app

# Menyalin file package.json dan package-lock.json ke dalam container
COPY package*.json ./

# Install dependencies
RUN npm install

# Menyalin seluruh file aplikasi ke dalam container
COPY . .

# Menyediakan environment variable yang diperlukan
# Mengatur variabel untuk Cloud Storage dan Firestore yang akan dibaca dari file .env
ENV PORT=8080
ENV MODEL_URL=https://storage.googleapis.com/submissionmlgc-mustafa-model/submissions-model/model.json
ENV GCP_PROJECT_ID=submissionmlgc-mustafa
ENV GCP_STORAGE_SERVICE=/path/to/storage.json

# Ekspos port yang digunakan oleh aplikasi
EXPOSE 8080

# Menjalankan aplikasi Node.js menggunakan perintah yang sesuai
CMD ["npm", "start"]
