const express = require('express'); //mengimpor express
const router = express.Router(); //membuat router baru

router.get('/test', (req, res) => { //menangani permintaan GET ke /test
  res.json({ message: 'Guru route OK' }); //mengirim respons JSON
});

module.exports = router; //mengekspor router untuk digunakan di bagian lain aplikasi
