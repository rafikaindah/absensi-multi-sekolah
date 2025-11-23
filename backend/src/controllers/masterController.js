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

// ------------------ PENDAFTARAN GURU ------------------
//mendapatkan semua data pendaftaran guru
exports.getPendaftaranGuru = async (req, res) => {
  try {
    const [rows] = await pool.query( //menjalankan query untuk mendapatkan semua data pendaftaran guru dengan informasi pengguna dan sekolah
      `SELECT pg.*, p.nama_lengkap, p.email, s.nama_sekolah
       FROM pendaftaran_guru pg
       JOIN pengguna p ON pg.id_pengguna = p.id_pengguna
       JOIN sekolah s ON pg.id_sekolah = s.id_sekolah
       ORDER BY s.nama_sekolah, p.nama_lengkap`
    );
    res.json(rows); //mengirim respons dengan data pendaftaran guru dalam format JSON
  } catch (err) { //menangani kesalahan
    res.status(500).json({ message: 'Gagal mengambil data pendaftaran guru' }); //mengirim respons 500 dengan pesan error
  }
};

//membuat data pendaftaran guru baru
exports.createPendaftaranGuru = async (req, res) => { 
  const { id_pengguna, id_sekolah } = req.body; //mengambil data dari body permintaan

  try {
    const [result] = await pool.query( //menjalankan query untuk memasukkan data pendaftaran guru baru
      `INSERT INTO pendaftaran_guru (id_pengguna, id_sekolah)
       VALUES (?, ?)`,
      [id_pengguna, id_sekolah]
    );
    res.status(201).json({ //mengirim respons 201 dengan id pendaftaran guru yang baru dibuat
      message: 'Pendaftaran guru berhasil ditambahkan',
      id_pendaftaran: result.insertId
    }); //id pendaftaran guru yang baru dibuat
  } catch (err) {
    // bisa terjadi error duplicate key (unique_pendaftaran) jika pengguna sudah mendaftar di sekolah yang sama
    res.status(500).json({ message: 'Gagal menambah pendaftaran guru' });
  }
};

//memperbarui data pendaftaran guru berdasarkan id
exports.updatePendaftaranGuru = async (req, res) => {
  const { id } = req.params; //mengambil id dari parameter rute
  const { id_pengguna, id_sekolah } = req.body; //mengambil data dari body permintaan

  try {
    await pool.query( //menjalankan query untuk memperbarui data pendaftaran guru
      `UPDATE pendaftaran_guru
       SET id_pengguna=?, id_sekolah=?
       WHERE id_pendaftaran=?`,
      [id_pengguna, id_sekolah, id]
    ); //nilai yang akan diperbarui
    res.json({ message: 'Pendaftaran guru berhasil diperbarui' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal update pendaftaran guru' }); 
  }
};

//menghapus data pendaftaran guru berdasarkan id
exports.deletePendaftaranGuru = async (req, res) => {
  const { id } = req.params; //mengambil id dari parameter rute

  try {
    await pool.query( //menjalankan query untuk menghapus data pendaftaran guru berdasarkan id
      `DELETE FROM pendaftaran_guru WHERE id_pendaftaran=?`,
      [id]
    ); //nilai yang akan dihapus berdasarkan id
    res.json({ message: 'Pendaftaran guru berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus pendaftaran guru' });
  }
};
// ------------------ AKHIR PENDAFTARAN GURU ------------------

// ------------------ JADWAL MENGAJAR ------------------
//mendapatkan semua data jadwal mengajar
exports.getJadwalMengajar = async (req, res) => {
  try {
    const [rows] = await pool.query( //menjalankan query untuk mendapatkan semua data jadwal mengajar dengan informasi lengkap
      `SELECT j.*,
              k.nama_kelas, k.tingkat,
              sek.nama_sekolah,
              m.nama_mapel,
              p.nama_lengkap AS nama_guru
       FROM jadwal_mengajar j
       JOIN pendaftaran_guru pg ON j.id_pendaftaran = pg.id_pendaftaran
       JOIN pengguna p ON pg.id_pengguna = p.id_pengguna
       JOIN sekolah sek ON pg.id_sekolah = sek.id_sekolah
       JOIN kelas k ON j.id_kelas = k.id_kelas
       JOIN mata_pelajaran m ON j.id_mapel = m.id_mapel
       ORDER BY sek.nama_sekolah, k.tingkat, k.nama_kelas, j.hari, j.jam_mulai`
    );
    res.json(rows); //mengirim respons dengan data jadwal mengajar dalam format JSON
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data jadwal mengajar' }); //mengirim respons 500 dengan pesan error
  }
};

//mendapatkan data jadwal mengajar berdasarkan id kelas
exports.getJadwalMengajarByKelas = async (req, res) => {
  const { id_kelas } = req.params; //mengambil id_kelas dari parameter rute
  try {
    const [rows] = await pool.query( //menjalankan query untuk mendapatkan data jadwal mengajar berdasarkan id kelas
      `SELECT j.*,
              m.nama_mapel,
              p.nama_lengkap AS nama_guru
       FROM jadwal_mengajar j
       JOIN pendaftaran_guru pg ON j.id_pendaftaran = pg.id_pendaftaran
       JOIN pengguna p ON pg.id_pengguna = p.id_pengguna
       JOIN mata_pelajaran m ON j.id_mapel = m.id_mapel
       WHERE j.id_kelas = ?
       ORDER BY j.hari, j.jam_mulai`,
      [id_kelas] //nilai id_kelas yang akan digunakan dalam query
    );
    res.json(rows); //mengirim respons dengan data jadwal mengajar dalam format JSON
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil jadwal per kelas' }); //mengirim respons 500 dengan pesan error
  }
};

//mendapatkan data jadwal mengajar berdasarkan id pendaftaran guru
exports.getJadwalMengajarByPendaftaran = async (req, res) => {
  const { id_pendaftaran } = req.params; //mengambil id_pendaftaran dari parameter rute

  try {
    const [rows] = await pool.query( //menjalankan query untuk mendapatkan data jadwal mengajar berdasarkan id pendaftaran guru
      `SELECT j.*,
              k.nama_kelas, k.tingkat,
              m.nama_mapel,
              p.nama_lengkap AS nama_guru,
              s.nama_sekolah
       FROM jadwal_mengajar j
       JOIN pendaftaran_guru pg ON j.id_pendaftaran = pg.id_pendaftaran
       JOIN pengguna p ON pg.id_pengguna = p.id_pengguna
       JOIN sekolah s ON pg.id_sekolah = s.id_sekolah
       JOIN kelas k ON j.id_kelas = k.id_kelas
       JOIN mata_pelajaran m ON j.id_mapel = m.id_mapel
       WHERE j.id_pendaftaran = ?
       ORDER BY j.hari, j.jam_mulai`,
      [id_pendaftaran] //nilai id_pendaftaran yang akan digunakan dalam query
    );

    res.json(rows); //mengirim respons dengan data jadwal mengajar dalam format JSON
  } catch (err) {
    console.error(err); //mencetak kesalahan ke konsol
    res.status(500).json({ message: 'Gagal mengambil jadwal berdasarkan pendaftaran guru' }); //mengirim respons 500 dengan pesan error
  }
};

//membuat data jadwal mengajar baru
exports.createJadwalMengajar = async (req, res) => {
  const { id_pendaftaran, id_kelas, id_mapel, hari, jam_mulai, jam_selesai } = req.body; //mengambil data dari body permintaan

  try {
    const [result] = await pool.query( //menjalankan query untuk memasukkan data jadwal mengajar baru
      `INSERT INTO jadwal_mengajar
       (id_pendaftaran, id_kelas, id_mapel, hari, jam_mulai, jam_selesai)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id_pendaftaran, id_kelas, id_mapel, hari, jam_mulai, jam_selesai] //nilai yang akan dimasukkan
    );
    res.status(201).json({ //mengirim respons 201 dengan id jadwal mengajar yang baru dibuat
      message: 'Jadwal mengajar berhasil ditambahkan',
      id_jadwal: result.insertId
    }); //id jadwal mengajar yang baru dibuat
  } catch (err) {
    res.status(500).json({ message: 'Gagal menambah jadwal mengajar' }); //mengirim respons 500 dengan pesan error
  }
};

//memperbarui data jadwal mengajar berdasarkan id
exports.updateJadwalMengajar = async (req, res) => {
  const { id } = req.params; //mengambil id dari parameter rute
  const { id_pendaftaran, id_kelas, id_mapel, hari, jam_mulai, jam_selesai } = req.body; //mengambil data dari body permintaan

  try {
    await pool.query(
      `UPDATE jadwal_mengajar
       SET id_pendaftaran=?, id_kelas=?, id_mapel=?, hari=?, jam_mulai=?, jam_selesai=?
       WHERE id_jadwal=?`,
      [id_pendaftaran, id_kelas, id_mapel, hari, jam_mulai, jam_selesai, id] //nilai yang akan diperbarui
    );
    res.json({ message: 'Jadwal mengajar berhasil diperbarui' }); //mengirim respons sukses
  } catch (err) {
    res.status(500).json({ message: 'Gagal update jadwal mengajar' }); //mengirim respons 500 dengan pesan error
  }
};

//menghapus data jadwal mengajar berdasarkan id
exports.deleteJadwalMengajar = async (req, res) => {
  const { id } = req.params; //mengambil id dari parameter rute

  try {
    await pool.query( //menjalankan query untuk menghapus data jadwal mengajar berdasarkan id
      `DELETE FROM jadwal_mengajar WHERE id_jadwal=?`,
      [id]
    );
    res.json({ message: 'Jadwal mengajar berhasil dihapus' }); //mengirim respons sukses
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus jadwal mengajar' }); //mengirim respons 500 dengan pesan error
  }
};
// ------------------ AKHIR JADWAL MENGAJAR ------------------