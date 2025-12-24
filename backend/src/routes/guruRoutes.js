const express = require('express'); //mengimpor express
const router = express.Router(); //membuat router baru
const auth = require('../middleware/auth'); //mengimpor middleware autentikasi
const roleCheck = require('../middleware/roleCheck'); //mengimpor middleware pemeriksaan peran
const guruController = require('../controllers/guruController'); //mengimpor controller guru

//checkin dan checkout routes
router.post('/checkin', auth, roleCheck(['guru']), guruController.checkin); 
router.post('/checkout', auth, roleCheck(['guru']), guruController.checkout); 

// jadwal mengajar routes
router.get('/jadwal-hari-ini', auth, roleCheck(['guru']), guruController.getJadwalHariIni); 
router.get('/jadwal-semua', auth, roleCheck(['guru']), guruController.getSemuaJadwal); 

// absensi siswa (negatif) routes
router.post('/absensi-siswa', auth, roleCheck(['guru']), guruController.absensiSiswa); 

//jurnal mengajar routes
router.post('/jurnal', auth, roleCheck(['guru']), guruController.jurnalMengajar); 

//catatan siswa routes
router.post('/catatan-siswa', auth, roleCheck(['guru']), guruController.catatanSiswa); 

// daftar siswa berdasarkan kelas
router.get('/siswa/kelas/:id_kelas', auth, roleCheck(['guru']), guruController.getSiswaByKelas);

//daftar kelas berdasarkan sekolah
router.get("/kelas/sekolah/:id_sekolah", auth, roleCheck(['guru']), guruController.getKelasBySekolah);

//report guru dan siswa
router.get('/report-guru', auth, roleCheck(['guru', 'admin']), guruController.getReportGuru);
router.get('/report-siswa', auth, roleCheck(['guru', 'admin']), guruController.getReportSiswa);

//status presensi & status selesai (hari ini)
router.get('/presensi-hari-ini', auth, roleCheck(['guru']), guruController.getPresensiHariIni);
router.get('/jadwal-selesai-hari-ini', auth, roleCheck(['guru']), guruController.getJadwalSelesaiHariIni);

//daftar sekolah berdasarkan guru
router.get('/sekolah/guru/:id_pengguna', auth, roleCheck(['admin']), guruController.getSekolahByGuru);

module.exports = router; //mengekspor router untuk digunakan di bagian lain aplikasi
