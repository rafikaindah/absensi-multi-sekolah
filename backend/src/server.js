const express = require('express'); //mengimpor express
const cors = require('cors'); //mengimpor cors untuk mengizinkan permintaan lintas asal 
require('dotenv').config(); //memuat variabel lingkungan dari file .env

const authRoutes = require('./routes/authRoutes'); //mengimpor route otentikasi
const masterRoutes = require('./routes/masterRoutes'); 
const guruRoutes = require('./routes/guruRoutes'); 
const adminRoutes = require('./routes/adminRoutes');

const app = express(); //membuat instance aplikasi express

app.use(cors()); //menggunakan middleware cors
app.use(express.json()); //menggunakan middleware untuk parsing JSON

// route dasar
app.get('/', (req, res) => { 
  res.json({ message: 'API Absensi Multi Sekolah' }); 
});

app.get('/api/test', (req, res) => { //endpoint untuk mengetes koneksi API
  res.json({ message: "API test berhasil" });
});


// daftar route
app.use('/api/auth', authRoutes); //menggunakan route otentikasi
app.use('/api/master', masterRoutes);
app.use('/api/guru', guruRoutes);
app.use('/api/admin', adminRoutes);

const PORT = process.env.PORT || 4000; //mengatur port server
app.listen(PORT, () => { //memulai server
  console.log(`Server running on port ${PORT}`); //menampilkan pesan di konsol saat server berjalan
});
