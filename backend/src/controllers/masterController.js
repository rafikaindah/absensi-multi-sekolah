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

// ------------------ KELAS ------------------
//mendapatkan semua data kelas
exports.getKelas = async (req, res) => { 
  try {
    const [rows] = await pool.query(
      `SELECT k.*, s.nama_sekolah 
       FROM kelas k
       JOIN sekolah s ON k.id_sekolah = s.id_sekolah
       ORDER BY s.nama_sekolah, k.tingkat, k.nama_kelas`
    ); //menjalankan query untuk mendapatkan semua data kelas dengan nama sekolah
    res.json(rows); //mengirim respons dengan data kelas dalam format JSON
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal mengambil data kelas' }); //mengirim respons 500 dengan pesan error
  }
};

//mendapatkan data kelas berdasarkan id sekolah
exports.getKelasBySekolah = async (req, res) => {
  const { id } = req.params; //mengambil id dari parameter rute

  try {
    const [rows] = await pool.query( //menjalankan query untuk mendapatkan data kelas berdasarkan id sekolah
      `SELECT * FROM kelas 
       WHERE id_sekolah = ?
       ORDER BY tingkat, nama_kelas`,
      [id]
    ); //

    res.json(rows); //mengirim respons dengan data kelas dalam format JSON
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal mengambil kelas per sekolah' }); //mengirim respons 500 dengan pesan error
  }
};

//membuat data kelas baru
exports.createKelas = async (req, res) => { //membuat data kelas baru
  const { id_sekolah, nama_kelas, tingkat } = req.body; //mengambil data dari body permintaan

  try { //menambahkan kelas baru ke database
    const [cek] = await pool.query( //memeriksa apakah sekolah dengan id_sekolah ada
      `SELECT id_sekolah FROM sekolah WHERE id_sekolah=?`,
      [id_sekolah]
    );
    if (cek.length === 0) { // mengecek apakah sekolah dengan id_sekolah tidak ditemukan
      return res.status(400).json({ message: 'Sekolah tidak ditemukan' }); //mengirim respons 400 jika sekolah tidak ditemukan
    }

    const [result] = await pool.query( //menjalankan query untuk memasukkan data kelas baru
      `INSERT INTO kelas (id_sekolah, nama_kelas, tingkat)
       VALUES (?, ?, ?)`,
       [id_sekolah, nama_kelas, tingkat]
    );

    res.status(201).json({ //mengirim respons 201 dengan id kelas yang baru dibuat
      message: 'Kelas berhasil ditambahkan',
      id_kelas: result.insertId 
    });

  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal menambah kelas' }); // mengirim respons 500 dengan pesan error
  }
};

//memperbarui data kelas berdasarkan id
exports.updateKelas = async (req, res) => { //memperbarui data kelas berdasarkan id
  const { id } = req.params; //mengambil id dari parameter rute
  const { id_sekolah, nama_kelas, tingkat } = req.body; //mengambil data dari body permintaan

  try { //memperbarui data kelas di database
    const [cek] = await pool.query( //memeriksa apakah kelas dengan id_kelas ada
      `SELECT id_kelas FROM kelas WHERE id_kelas=?`,
      [id]
    );
    if (cek.length === 0) { // mengecek apakah kelas dengan id_kelas tidak ditemukan
      return res.status(404).json({ message: 'Kelas tidak ditemukan' }); //mengirim respons 404 jika kelas tidak ditemukan
    }

    await pool.query( //menjalankan query untuk memperbarui data kelas
      `UPDATE kelas
       SET id_sekolah=?, nama_kelas=?, tingkat=?
       WHERE id_kelas=?`,
       [id_sekolah, nama_kelas, tingkat, id] //nilai yang akan diperbarui
    );

    res.json({ message: 'Kelas berhasil diperbarui' }); //mengirim respons sukses

  } catch (err) {
    res.status(500).json({ message: 'Gagal update kelas' }); //mengirim respons 500 dengan pesan error
  }
};

//menghapus data kelas berdasarkan id
exports.deleteKelas = async (req, res) => { //menghapus data kelas berdasarkan id
  const { id } = req.params; //mengambil id dari parameter rute

  try {
    await pool.query(`DELETE FROM kelas WHERE id_kelas=?`, [id]); //menjalankan query untuk menghapus data kelas berdasarkan id
    res.json({ message: 'Kelas berhasil dihapus' }); //mengirim respons sukses
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal menghapus kelas' }); //mengirim respons 500 dengan pesan error
  }
};

// ------------------ AKHIR KELAS ------------------

// ------------------ SISWA ------------------
//mendapatkan semua data siswa
exports.getSiswa = async (req, res) => { 
  try { 
    const [rows] = await pool.query( //menjalankan query untuk mendapatkan semua data siswa dengan informasi kelas dan sekolah
      `SELECT s.*, k.nama_kelas, k.tingkat, sek.nama_sekolah                
       FROM siswa s                                                         
       JOIN kelas k ON s.id_kelas = k.id_kelas                              
       JOIN sekolah sek ON k.id_sekolah = sek.id_sekolah                    
       ORDER BY sek.nama_sekolah, k.tingkat, k.nama_kelas, s.nama_lengkap`  
    ); //mengambil data siswa beserta nama kelas, tingkat, dan nama sekolah dengan pengurutan tertentu
    res.json(rows); //mengirim respons dengan data siswa dalam format JSON
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal mengambil data siswa' }); //mengirim respons 500 dengan pesan error
  }
};

//mendapatkan data siswa berdasarkan id kelas
exports.getSiswaByKelas = async (req, res) => { 
  const { id_kelas } = req.params; //mengambil id_kelas dari parameter rute
  try {
    const [rows] = await pool.query( //menjalankan query untuk mendapatkan data siswa berdasarkan id kelas
      `SELECT * FROM siswa       
       WHERE id_kelas = ?        
       ORDER BY nama_lengkap`,   
      [id_kelas]
    ); 
    res.json(rows); //mengirim respons dengan data siswa dalam format JSON
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal mengambil siswa per kelas' }); //mengirim respons 500 dengan pesan error
  }
};

//membuat data siswa baru
exports.createSiswa = async (req, res) => { 
  const { id_kelas, nis, nama_lengkap } = req.body; //mengambil data dari body permintaan

  try {
    const [result] = await pool.query( //menjalankan query untuk memasukkan data siswa baru
      `INSERT INTO siswa (id_kelas, nis, nama_lengkap)   
       VALUES (?, ?, ?)`,                                //nilai yang akan dimasukkan
      [id_kelas, nis, nama_lengkap]                      // nilai yang akan dimasukkan
    );
    res.status(201).json({ // mengirim respons 201 dengan id siswa yang baru dibuat
      message: 'Siswa berhasil ditambahkan', //pesan sukses
      id_siswa: result.insertId //id siswa yang baru dibuat
    });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambah siswa' }); //mengirim respons 500 dengan pesan error
  }
};

//memperbarui data siswa berdasarkan id
exports.updateSiswa = async (req, res) => {
  const { id } = req.params; // mengambil id dari parameter rute
  const { id_kelas, nis, nama_lengkap } = req.body; //mengambil data dari body permintaan

  try {
    await pool.query( //menjalankan query untuk memperbarui data siswa
      `UPDATE siswa                            
       SET id_kelas=?, nis=?, nama_lengkap=?   
       WHERE id_siswa=?`,                      
      [id_kelas, nis, nama_lengkap, id]
    ); 
    res.json({ message: 'Siswa berhasil diperbarui' });  //mengirim respons sukses
  } catch (err) {
    res.status(500).json({ message: 'Gagal update siswa' }); //mengirim respons 500 dengan pesan error
  }
};

//menghapus data siswa berdasarkan id
exports.deleteSiswa = async (req, res) => { //menghapus data siswa berdasarkan id
  const { id } = req.params; // mengambil id dari parameter rute
  try {
    await pool.query(`DELETE FROM siswa WHERE id_siswa=?`, [id]); //menjalankan query untuk menghapus data siswa berdasarkan id
    res.json({ message: 'Siswa berhasil dihapus' }); //mengirim respons sukses
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus siswa' }); //mengirim respons 500 dengan pesan error
  }
};
// ------------------ AKHIR SISWA ------------------

// ------------------ MAPEL ------------------
//mendapatkan semua data mata pelajaran
exports.getMapel = async (req, res) => {
  try {
    const [rows] = await pool.query(//menjalankan query untuk mendapatkan semua data mata pelajaran
      `SELECT * FROM mata_pelajaran
       ORDER BY nama_mapel`
    );
    res.json(rows); //mengirim respons dengan data mata pelajaran dalam format JSON
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data mata pelajaran' }); //mengirim respons 500 dengan pesan error
  }
};

//membuat data mata pelajaran baru
exports.createMapel = async (req, res) => { 
  const { nama_mapel } = req.body; //mengambil data dari body permintaan

  try {
    const [result] = await pool.query( //menjalankan query untuk memasukkan data mata pelajaran baru
      `INSERT INTO mata_pelajaran (nama_mapel)
       VALUES (?)`,
      [nama_mapel]
    );
    res.status(201).json({ //mengirim respons 201 dengan id mata pelajaran yang baru dibuat
      message: 'Mata pelajaran berhasil ditambahkan',
      id_mapel: result.insertId //id mata pelajaran yang baru dibuat
    }); 
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambah mata pelajaran' }); //mengirim respons 500 dengan pesan error
  }
};

//memperbarui data mata pelajaran berdasarkan id
exports.updateMapel = async (req, res) => {
  const { id } = req.params; //mengambil id dari parameter rute
  const { nama_mapel } = req.body; //mengambil data dari body permintaan

  try {
    await pool.query( //menjalankan query untuk memperbarui data mata pelajaran
      `UPDATE mata_pelajaran
       SET nama_mapel=?
       WHERE id_mapel=?`,
      [nama_mapel, id]
    );
    res.json({ message: 'Mata pelajaran berhasil diperbarui' }); //mengirim respons sukses
  } catch (err) {
    res.status(500).json({ message: 'Gagal update mata pelajaran' }); //mengirim respons 500 dengan pesan error
  }
};

//menghapus data mata pelajaran berdasarkan id
exports.deleteMapel = async (req, res) => {
  const { id } = req.params; //mengambil id dari parameter rute
  try {
    await pool.query(`DELETE FROM mata_pelajaran WHERE id_mapel=?`, [id]); //menjalankan query untuk menghapus data mata pelajaran berdasarkan id
    res.json({ message: 'Mata pelajaran berhasil dihapus' }); //mengirim respons sukses
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal menghapus mata pelajaran' }); //mengirim respons 500 dengan pesan error
  }
};
// ------------------ AKHIR MAPEL ------------------