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
1. Jalankan `docker-compose up --build`

### If you want to use node instead
1. Pindah ke direktori `ban-kanban`
2. Install package dengan `npm install`
3. Dont forget to setup the local database
4. Jalankan dengan
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
