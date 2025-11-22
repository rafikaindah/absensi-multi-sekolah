const express = require('express'); //mengimpor express
const router = express.Router(); //membuat router baru
const auth = require('../middleware/auth'); //mengimpor middleware autentikasi
const roleCheck = require('../middleware/roleCheck'); //mengimpor middleware pemeriksaan peran
const masterController = require('../controllers/masterController'); //mengimpor controller master

// rute untuk mendapatkan semua data master dengan perlindungan autentikasi dan pemeriksaan peran admin
router.use(auth, roleCheck('admin')); 

//sekolah routes
router.get('/sekolah', masterController.getSekolah); //mendapatkan semua data sekolah
router.post('/sekolah', masterController.createSekolah); //membuat data sekolah baru
router.put('/sekolah/:id', masterController.updateSekolah); //memperbarui data sekolah berdasarkan id
router.delete('/sekolah/:id', masterController.deleteSekolah); //menghapus data sekolah berdasarkan id

//pengguna routes
router.get('/pengguna', masterController.getPengguna); //mendapatkan semua data pengguna
router.post('/pengguna', masterController.createPengguna); //membuat data pengguna baru
router.put('/pengguna/:id', masterController.updatePengguna); //memperbarui data pengguna berdasarkan id
router.delete('/pengguna/:id', masterController.deletePengguna); //menghapus data pengguna berdasarkan id

// kelas routes
router.get('/kelas', masterController.getKelas); //mendapatkan semua data kelas
router.get('/kelas/sekolah/:id', masterController.getKelasBySekolah); //mendapatkan data kelas berdasarkan id sekolah
router.post('/kelas', masterController.createKelas); //membuat data kelas baru
router.put('/kelas/:id', masterController.updateKelas); //memperbarui data kelas berdasarkan id
router.delete('/kelas/:id', masterController.deleteKelas); //menghapus data kelas berdasarkan id

//siswa routes
router.get('/siswa', masterController.getSiswa); //mendapatkan semua data siswa
router.get('/siswa/kelas/:id_kelas', masterController.getSiswaByKelas); //  mendapatkan data siswa berdasarkan id kelas
router.post('/siswa', masterController.createSiswa); //membuat data siswa baru
router.put('/siswa/:id', masterController.updateSiswa); //memperbarui data siswa berdasarkan id
router.delete('/siswa/:id', masterController.deleteSiswa); //menghapus data siswa berdasarkan id

module.exports = router; //mengekspor router untuk digunakan di bagian lain aplikasi
