const express = require('express'); //mengimpor express
const router = express.Router(); //membuat router baru
const auth = require('../middleware/auth'); //mengimpor middleware autentikasi
const roleCheck = require('../middleware/roleCheck'); //mengimpor middleware pemeriksaan peran
const guruController = require('../controllers/guruController'); //mengimpor controller guru

// rute untuk mendapatkan semua data guru dengan perlindungan autentikasi dan pemeriksaan peran guru
router.use(auth, roleCheck(['guru'])); 

//checkin dan checkout routes
router.post('/checkin', guruController.checkin); //rute untuk checkin
router.post('/checkout', guruController.checkout); //rute untuk checkout

// jadwal mengajar routes
router.get('/jadwal-hari-ini', guruController.getJadwalHariIni); // rute untuk mendapatkan jadwal hari ini
router.get('/jadwal-semua', guruController.getSemuaJadwal); // rute untuk mendapatkan semua jadwal

// absensi siswa (negatif) routes
router.post('/absensi-siswa', guruController.absensiSiswa); // rute untuk menyimpan absensi siswa

module.exports = router; //mengekspor router untuk digunakan di bagian lain aplikasi
