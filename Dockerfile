# Gunakan image dasar Node.js
FROM node:18-slim

# Tentukan direktori kerja di dalam container
WORKDIR /app

# Salin package.json dan package-lock.json untuk instalasi dependensi
COPY package*.json ./

# Install dependencies
RUN npm install

# Salin seluruh aplikasi ke dalam container
COPY . .

# Tentukan variabel lingkungan
ENV PORT=8080
ENV MODEL_URL=${MODEL_URL} 
ENV GOOGLE_APPLICATION_CREDENTIALS=/path/to/storage_service_key.json 

# Menyalin kredensial storage.json dari GitHub secrets (via GitHub Actions)
COPY bucket_service_key.json /path/to/storage_service_key.json

# Tentukan perintah untuk menjalankan aplikasi
CMD ["node", "index.js"]
