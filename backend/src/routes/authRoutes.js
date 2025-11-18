const express = require('express'); //mengimpor express
const router = express.Router(); //membuat router express
const { login } = require('../controllers/authController'); //mengimpor controller otentikasi

router.post('/login', login); //route untuk login

module.exports = router; //mengekspor router
