# Bankanban


<p align="center">
Kanban board, tapi versi lokal! Software ini dibuat untuk memenuhi proses seleksi dari Frontend Engineer pada Ihsan Solusi Informatika
</p>


<p align="center">
  <a href="#about">About</a> |
  <a href="#system-requirement">System Requirements</a> |
  <a href="#how-to-run">How to Run</a> |
  <a href="#features">Features</a>
</p>

## About
Aplikasi Kanban Board adalah sebuah platform manajemen tugas berbasis web yang dirancang untuk mempermudah pengorganisasian dan pelacakan pekerjaan tim. Aplikasi ini dibangun menggunakan framework Next.js dan bahasa TypeScript untuk memastikan performa yang optimal serta pengalaman pengguna yang lancar dan responsif.

## System Requirement

- Docker, hanya docker!

## How to Run
### Cloning repository
1. Pada halaman utama repository [GitHub](https://github.com/zshnrg/FE_ISI_TEST_ROZAN), buka menu **Clone** lalu salin URL dari repository
2. Buka Terminal
3. Pindah ke direktori yang diinginkan
4. Ketikan `git clone`, lalu tempelkan URL yang telah disalin tadi 
   ```sh
   git clone https://github.com/zshnrg/FE_ISI_TEST_ROZAN.git
   ```

### Running the app
1. Buat file `.env.docker` dengan template `.env.example`
   ```.env
   DATABASE_URL=postgres://postgres:postgres@postgres:5432/FE_ISI_TEST_ROZAN

   SALT_ROUNDS=10

   JWT_SECRET='your_jwt_secret_key'

   ```
2. Jalankan `docker-compose up --build`

### If you want to use local node instead
1. Pindah ke direktori `ban-kanban`
2. Buat file `.env.local` dengan template `.env.example`
   ```
   DB_USER=user
   DB_PASSWORD=password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=bankanban_local

   SALT_ROUNDS=10

   JWT_SECRET='your_jwt_secret_key'
   ```
3. Buat database local dengan nama yang sesuai
   ```
   CREATE DATABASE kanban_local;
   ```
4. Lakukan migrasi dengan data dari `init.sql`
   ```
   psql -U postgres -d kanban_local -f init.sql
   ```
5. Install package dengan `npm install`
6. Build dan start aplikasi
   ```
   npm run build
   npm run start
   ```

## Features
Program ini memiliki fitur:
- Login dan pendaftaran akun
- Collaborative project berbasis invitation code
- Responsive Kanban Board
- History log preservation 
