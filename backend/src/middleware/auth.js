const jwt = require('jsonwebtoken'); //mengimpor jsonwebtoken untuk verifikasi token

module.exports = function (req, res, next) { //middleware otentikasi
  const authHeader = req.headers['authorization']; // Mendapatkan header Authorization
  const token = authHeader && authHeader.split(' ')[1]; // Mendapatkan token dari header

  if (!token) { 
    return res.status(401).json({ message: 'Token tidak ada' }); // Jika token tidak ada, kirim respons 401 
  }

  try { // Verifikasi token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ganti dengan kunci rahasia Anda
    req.user = decoded; // { id_pengguna, peran } // Menyimpan data pengguna yang terverifikasi di objek req
    next(); // Lanjutkan ke middleware atau route berikutnya
  } catch (err) { // Jika verifikasi gagal
    return res.status(403).json({ message: 'Token tidak valid' }); // Kirim respons 403
  }
};
