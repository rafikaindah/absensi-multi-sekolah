**APLIKASI ABSENSI GURU MULTI SEKOLAH**
Aplikasi web untuk membantu beberapa sekolah dalam mengelola absensi guru dan siswa dalam satu sistem. Aplikasi ini menggunakan QR Code untuk proses presensi guru.
Selain presensi, aplikasi juga menyediakan fitur jadwal mengajar, absensi siswa, jurnal kegiatan belajar mengajar, catatan siswa, dan laporan.

**Fitur**
Aplikasi ini terdiri dari 2 pengguna yaitu Admin dan Guru
1. Admin
   - Dashboard: menampilkan ringkasan informasi sistem, seperti data pengguna, sekolah, dan informasi lainnya yang berkaitan dengan pengelolaan absensi.
   - QR Code Sekolah: digunakan untuk menampilkan QR Code yang digunakan guru untuk melakukan presensi. QR Code diperbarui secara berkala.
   - Master data yang terdiri dari
     a. data pengguna: digunakan untuk mengelola akun pengguna yang dapat mengakses aplikasi.
     b. data sekolah: digunakan untuk menambahkan dan mengelola data sekolah yang terdaftar dalam sistem.
     c. data kelas: digunakan untuk mengelola data kelas yang terdapat pada masing-masing sekolah.
     d. data siswa: digunakan untuk menambah dan mengelola data siswa berdasarkan sekolah dan kelas.
     e. data mata pelajaran: digunakan untuk mengelola data mata pelajaran yang digunakan dalam kegiatan belajar mengajar.
     f. jadwal mengajar: digunakan untuk mengatur jadwal mengajar guru berdasarkan mata pelajaran, kelas, sekolah, dan waktu mengajar.
   - Report Absensi Guru dan Siswa: digunakan untuk melihat dan memantau data absensi guru dan siswa berdasarkan data yang tersimpan dalam sistem.
2. Guru
   - Dashboard: menampilkan informasi terkait aktivitas guru, seperti status presensi dan jadwal mengajar.
   - Presensi Check-in/Check-out menggunakan QR Code: digunakan guru untuk melakukan presensi masuk dan pulang dengan cara memindai QR Code sekolah.
   - Jadwal Mengajar: menampilkan jadwal mengajar guru, termasuk mata pelajaran, kelas, sekolah, waktu, dan status jadwal.
   - Absensi Siswa: digunakan guru untuk mencatat kehadiran siswa pada saat kegiatan belajar mengajar, seperti hadir, alpa, sakit, atau izin.
   - Jurnal Kegiatan Belajar Mengajar: digunakan guru untuk mencatat kegiatan atau materi terkait siswa selama kegiatan belajar mengajar.
   - Catatan Siswa: digunakan guru untuk memberikan catatan terkait siswa selama kegiatan belajar mengajar.
   - Report Absensi dan Jurnal: digunakan untuk melihat kembali data presensi dan jurnal kegiatan belajarn mengajar yang telah dilakukan.
  
**Teknologi yang digunakan**
Frontend
- Javascript
- React + JSX
- React Router
- Axios
- Vite
- CSS
- html5-qrcode

Backend
- Node.js
- Express.js
- JavaScript
- JWT Authentication
- Role-Based Acces Control (RBAC)

Database
- MySQL/MariaDB
- SQL
- XAMPP
- phpMyAdmin

Development Tools
- Visual Studio Code
- Google Chrome

**Cara Kerja Sistem**
1. Admin membuat akun pengguna.
2. Pengguna login menggunakan email dan password.
3. Sistem menampilkan halaman sesuai dengan role pengguna, yaitu Admin atau Guru
4. Jika masuk sebagai admin, akan mengelola master data. dan jika masuk sebagai guru, akan menampilkan halaman guru.
5. Dihalaman guru, guru melakukan check-in dengan memindai QR Code sekolah.
6. Guru menjalankan jadwal mengajar.
7. Guru mengisi absensi siswa dan jurnal kegiatan belajar mengajar.
8. Guru dapat menambahkan catatan siswa jika diperlukan.
9. Guru melakukan check-out setelah selesai.
10. Data yang telah tersimpan dapat dilihat melalui menu Report.

**Menjalankan Project**
Menjalankan backend:
- masuk ke folder backend
  cd backend
  npm install
  npm run dev
- backend secara default berjalan pada: http://localhost:4000

Menjalankan frontend:
- buka terminal baru, kemudian masuk ke folder frontend
  cd frontend
  npm install
  npm run dev
- frontend secara default berjalan pada: http://localhost:5173

**Database**
Database menggunakan MySQL/MariaDB yang dijalankan melalui XAMPP.
File database dapat dilihat melalui Google Drive:
https://drive.google.com/file/d/1ggnSDQLOVOKyMBf0S-10RyiHcdYO568F/view?usp=drive_link

**Dokumentasi**
Panduan lengkap penggunaan aplikasi dapat dilihat melalui Google Drive:
https://drive.google.com/file/d/19Jb4NdkLkTRf8gsVONWHAbetpkjQZ-Jv/view?usp=drivesdk
