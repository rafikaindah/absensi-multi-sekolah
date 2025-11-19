const pool = require('../config/db'); //mengimpor koneksi database

// ------------------ SEKOLAH ------------------
exports.getSekolah = async (req, res) => { //mendapatkan semua data sekolah
  try { // mencoba menjalankan kode berikut
    const [rows] = await pool.query('SELECT * FROM sekolah'); //menjalankan query untuk mendapatkan semua data sekolah
    res.json(rows); //mengirim respons dengan data sekolah dalam format JSON
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal mengambil data sekolah' }); //mengirim respons 500 dengan pesan error
  }
};

exports.createSekolah = async (req, res) => { //membuat data sekolah baru
  const { nama_sekolah, alamat, telepon } = req.body; //mengambil data dari body permintaan
  try { 
    const [result] = await pool.query( //menjalankan query untuk memasukkan data sekolah baru
      'INSERT INTO sekolah (nama_sekolah, alamat, telepon) VALUES (?, ?, ?)', //query untuk memasukkan data sekolah baru
      [nama_sekolah, alamat, telepon] //nilai yang akan dimasukkan
    );
    res.status(201).json({ id_sekolah: result.insertId }); //mengirim respons 201 dengan id sekolah yang baru dibuat
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambah sekolah' }); //mengirim respons 500 dengan pesan error
  }
};

exports.updateSekolah = async (req, res) => { //memperbarui data sekolah berdasarkan id
  const { id } = req.params; //mengambil id dari parameter rute
  const { nama_sekolah, alamat, telepon } = req.body; //mengambil data dari body permintaan
  try {
    await pool.query( //menjalankan query untuk memperbarui data sekolah
      'UPDATE sekolah SET nama_sekolah=?, alamat=?, telepon=? WHERE id_sekolah=?', //query untuk memperbarui data sekolah
      [nama_sekolah, alamat, telepon, id] //nilai yang akan diperbarui
    );
    res.json({ message: 'Sekolah diperbarui' }); //mengirim respons sukses
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal update sekolah' }); //mengirim respons 500 dengan pesan error
  }
};

exports.deleteSekolah = async (req, res) => {//menghapus data sekolah berdasarkan id
  const { id } = req.params; //mengambil id dari parameter rute
  try {
    await pool.query('DELETE FROM sekolah WHERE id_sekolah=?', [id]); //menjalankan query untuk menghapus data sekolah berdasarkan id
    res.json({ message: 'Sekolah dihapus' }); //mengirim respons sukses
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal hapus sekolah' }); //mengirim respons 500 dengan pesan error
  }
};
// ------------------ AKHIR SEKOLAH ------------------

// ------------------ PENGGUNA ------------------
const bcrypt = require('bcryptjs'); //mengimpor bcryptjs untuk hashing password
exports.getPengguna = async (req, res) => { //mendapatkan semua data pengguna
  try { //
    const [rows] = await pool.query('SELECT id_pengguna, nama_lengkap, email, peran FROM pengguna'); //menjalankan query untuk mendapatkan semua data pengguna
    res.json(rows); //mengirim respons dengan data pengguna dalam format JSON
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal mengambil data pengguna' }); //mengirim respons 500 dengan pesan error
  }
};

exports.createPengguna = async (req, res) => { // membuat data pengguna baru
  const { nama_lengkap, email, password, peran } = req.body; //mengambil data dari body permintaan

  try { //menambahkan pengguna baru ke database
    const hash = await bcrypt.hash(password, 10); //meng-hash password pengguna

    const [result] = await pool.query( //menjalankan query untuk memasukkan data pengguna baru
      'INSERT INTO pengguna (nama_lengkap, email, password_hash, peran) VALUES (?, ?, ?, ?)', //query untuk memasukkan data pengguna baru
      [nama_lengkap, email, hash, peran] //nilai yang akan dimasukkan
    );

    res.status(201).json({ id_pengguna: result.insertId }); //mengirim respons 201 dengan id pengguna yang baru dibuat
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal menambah pengguna' }); //mengirim respons 500 dengan pesan error
  }
};

exports.updatePengguna = async (req, res) => { //memperbarui data pengguna berdasarkan id
  const { id } = req.params; //mengambil id dari parameter rute
  const { nama_lengkap, email, peran } = req.body; //mengambil data dari body permintaan

  try { //memperbarui data pengguna di database
    await pool.query( //menjalankan query untuk memperbarui data pengguna
      'UPDATE pengguna SET nama_lengkap=?, email=?, peran=? WHERE id_pengguna=?', //query untuk memperbarui data pengguna
      [nama_lengkap, email, peran, id] //nilai yang akan diperbarui
    ); //mengirim respons sukses
    res.json({ message: 'Pengguna diperbarui' }); //mengirim respons sukses
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal update pengguna' }); //mengirim respons 500 dengan pesan error
  }
};

exports.deletePengguna = async (req, res) => { //menghapus data pengguna berdasarkan id
  const { id } = req.params; //mengambil id dari parameter rute
  try { //menghapus pengguna dari database
    await pool.query('DELETE FROM pengguna WHERE id_pengguna=?', [id]); //menjalankan query untuk menghapus data pengguna berdasarkan id
    res.json({ message: 'Pengguna dihapus' }); //mengirim respons sukses
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal menghapus pengguna' }); //mengirim respons 500 dengan pesan error
  }
};
// ------------------ AKHIR PENGGUNA ------------------