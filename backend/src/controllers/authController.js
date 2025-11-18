const pool = require('../config/db'); //mengimpor koneksi database
const jwt = require('jsonwebtoken'); //mengimpor jsonwebtoken untuk pembuatan token
const bcrypt = require('bcryptjs'); //mengimpor bcryptjs untuk hashing password

exports.login = async (req, res) => { //fungsi login
  const { email, password } = req.body; //mengambil email dan password dari body permintaan

  try { //mencoba menjalankan kode berikut
    const [rows] = await pool.query( // menjalankan query database
      'SELECT * FROM pengguna WHERE email = ?', // query untuk mendapatkan pengguna berdasarkan email
      [email] 
    );

    if (rows.length === 0) { // jika tidak ada pengguna dengan email tersebut
      return res.status(400).json({ message: 'Email tidak terdaftar' }); // mengirim respons 400 dengan pesan error 
    }

    const user = rows[0]; // mengambil data pengguna pertama

    // kalau password_hash sudah disimpan pakai bcrypt:
    const match = await bcrypt.compare(password, user.password_hash); // membandingkan password yang diberikan dengan hash yang disimpan
    if (!match) { // jika password tidak cocok
      return res.status(400).json({ message: 'Password salah' }); // mengirim respons 400 dengan pesan error
    }

    const token = jwt.sign( // membuat token JWT
      {
        id_pengguna: user.id_pengguna, // menyertakan id_pengguna dalam payload token
        peran: user.peran, // menyertakan peran dalam payload token
        nama_lengkap: user.nama_lengkap, // menyertakan nama_lengkap dalam payload token
      },
      process.env.JWT_SECRET, // kunci rahasia untuk menandatangani token
      { expiresIn: '8h' } // masa berlaku token selama 8 jam
    );

    res.json({ // mengirim respons sukses dengan token dan data pengguna
      message: 'Login berhasil',
      token, // mengirim token JWT
      user: { // mengirim data pengguna
        id_pengguna: user.id_pengguna, // id pengguna
        nama_lengkap: user.nama_lengkap, // nama lengkap pengguna
        email: user.email, // email pengguna
        peran: user.peran, // peran pengguna
      },
    });
  } catch (err) { // menangani kesalahan
    console.error(err); // mencetak kesalahan ke konsol
    res.status(500).json({ message: 'Terjadi kesalahan server' }); // mengirim respons 500 dengan pesan error
  }
};
