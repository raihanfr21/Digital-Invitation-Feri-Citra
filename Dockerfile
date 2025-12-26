# Gunakan image Nginx ringan
FROM nginx:alpine

# Hapus konfigurasi default
RUN rm -rf /usr/share/nginx/html/*

# Salin file statis ke root Nginx
COPY . /usr/share/nginx/html

# Salin konfigurasi custom agar Nginx listen di port 8080 (Cloud Run requirement)
COPY nginx.conf /etc/nginx/nginx.conf

# Port yang digunakan oleh Cloud Run
EXPOSE 8080

# Jalankan Nginx
CMD ["nginx", "-g", "daemon off;"]
