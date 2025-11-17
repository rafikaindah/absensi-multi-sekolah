const mysql = require('mysql2/promise'); //menggunakan mysql2 dengan promise
require('dotenv').config(); //memuat variabel lingkungan dari file .env

// Membuat pool (kolam) koneksi ke database MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost', //alamat host database
  user: process.env.DB_USER || 'root', //nama pengguna database
  password: process.env.DB_PASS || '', //kata sandi pengguna database
  database: process.env.DB_NAME || 'db_absensi_multi_sekolah', //nama database
  waitForConnections: true, //menunggu koneksi jika pool penuh  
  connectionLimit: 10, //batas maksimum koneksi dalam pool
  queueLimit: 0, //tidak ada batasan antrian koneksi
});

module.exports = pool; //mengekspor pool koneksi untuk digunakan di bagian lain aplikasi
