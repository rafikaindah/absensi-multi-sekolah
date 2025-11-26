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

module.exports = router; //mengekspor router untuk digunakan di bagian lain aplikasi
