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

module.exports = router; //mengekspor router untuk digunakan di bagian lain aplikasi
