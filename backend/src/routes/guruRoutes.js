const express = require('express'); //mengimpor express
const router = express.Router(); //membuat router baru
const auth = require('../middleware/auth'); //mengimpor middleware autentikasi
const roleCheck = require('../middleware/roleCheck'); //mengimpor middleware pemeriksaan peran
const guruController = require('../controllers/guruController'); //mengimpor controller guru

// rute untuk mendapatkan semua data guru dengan perlindungan autentikasi dan pemeriksaan peran guru
router.use(auth, roleCheck(['guru'])); 

//checkin dan checkout routes
router.post('/checkin', guruController.checkin); 
router.post('/checkout', guruController.checkout); 

// jadwal mengajar routes
router.get('/jadwal-hari-ini', guruController.getJadwalHariIni); 
router.get('/jadwal-semua', guruController.getSemuaJadwal); 

// absensi siswa (negatif) routes
router.post('/absensi-siswa', guruController.absensiSiswa); 

//jurnal mengajar routes
router.post('/jurnal', guruController.jurnalMengajar); 

//catatan siswa routes
router.post('/catatan-siswa', guruController.catatanSiswa); 

// daftar siswa berdasarkan kelas
router.get('/siswa/kelas/:id_kelas', guruController.getSiswaByKelas);

//report guru
router.get('/report-guru', guruController.getReportGuru);

module.exports = router; //mengekspor router untuk digunakan di bagian lain aplikasi
