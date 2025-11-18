module.exports = function (roles = []) { // middleware pengecekan peran
  // roles bisa array/string
  if (typeof roles === 'string') { // jika roles adalah string, ubah menjadi array
    roles = [roles]; // contoh: 'admin' => ['admin']
  }

  return (req, res, next) => { // middleware yang dikembalikan
    if (!req.user || !roles.includes(req.user.peran)) { // cek apakah peran pengguna ada dan sesuai
      return res.status(403).json({ message: 'Akses ditolak' }); // jika tidak sesuai, kirim respons 403
    }
    next(); // lanjutkan ke middleware atau route berikutnya
  };
};
