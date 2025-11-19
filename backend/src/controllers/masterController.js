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