const pool = require('../config/db'); //mengimpor konfigurasi database
const dayjs = require('dayjs'); //mengimpor dayjs untuk mengatur tanggal dan waktu

//fungsi untuk mendapatkan tanggal hari ini dalam format YYYY-MM-DD
const todayDate = () => dayjs().format('YYYY-MM-DD');

const todayHari = () => { //fungsi untuk mendapatkan nama hari ini
  const idx = dayjs().day(); //mengambil indeks hari dalam seminggu (0-6)
  const namaHari = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']; //array nama hari dalam bahasa Indonesia
  return namaHari[idx]; //mengembalikan nama hari berdasarkan indeks
};

// fungsi untuk melakukan checkin guru
exports.checkin = async (req, res) => {
  const { id_sekolah } = req.body; ///mengambil id_sekolah dari body request dari QR code
  const id_pengguna = req.user.id_pengguna; //mengambil id_pengguna dari token autentikasi

  try {
    // Cek apakah punya jadwal di hari ini di sekolah ini
    const [jadwal] = await pool.query(
      `SELECT j.id_jadwal
       FROM jadwal_mengajar j
       JOIN pendaftaran_guru pg ON j.id_pendaftaran = pg.id_pendaftaran
       WHERE pg.id_pengguna = ? 
         AND pg.id_sekolah = ?
         AND j.hari = ?`,
      [id_pengguna, id_sekolah, todayHari()] //menggunakan fungsi todayHari untuk mendapatkan nama hari ini
    );

    if (jadwal.length === 0) { //jika tidak ada jadwal mengajar hari ini di sekolah itu
      return res 
        .status(400)
        .json({ message: 'Anda tidak memiliki jadwal mengajar hari ini di sekolah ini' });
    }

    // cek apakah sudah check-in hari ini di sekolah itu
    const [rows] = await pool.query(
      `SELECT * FROM sesi_absensi_guru 
       WHERE id_pengguna=? AND id_sekolah=? AND tanggal=?`,
      [id_pengguna, id_sekolah, todayDate()]
    );

    if (rows.length > 0) {
      return res
        .status(400)
        .json({ message: 'Anda sudah check-in hari ini di sekolah ini' });
    }

    const [result] = await pool.query( //melakukan insert data checkin ke database
      `INSERT INTO sesi_absensi_guru 
       (id_pengguna, id_sekolah, waktu_masuk, tanggal)
       VALUES (?, ?, NOW(), ?)`,
      [id_pengguna, id_sekolah, todayDate()] //         
    );

    res.status(201).json({
      message: 'Check-in berhasil',
      id_sesi: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal check-in' });
  }
};

// fungsi untuk melakukan checkout guru
exports.checkout = async (req, res) => {
  const { id_sekolah } = req.body; //mengambil id_sekolah dari body request dari QR code/id sesi
  const id_pengguna = req.user.id_pengguna; //mengambil id_pengguna dari token autentikasi

  try {
    // Cek apakah punya jadwal di hari ini di sekolah ini
    const [jadwal] = await pool.query(
      `SELECT j.id_jadwal
       FROM jadwal_mengajar j
       JOIN pendaftaran_guru pg ON j.id_pendaftaran = pg.id_pendaftaran
       WHERE pg.id_pengguna = ? 
         AND pg.id_sekolah = ?
         AND j.hari = ?`,
      [id_pengguna, id_sekolah, todayHari()]
    );

    if (jadwal.length === 0) {
      return res
        .status(400)
        .json({ message: 'Anda tidak memiliki jadwal mengajar hari ini di sekolah ini' });
    }

    // Cari sesi aktif untuk checkout
    const [rows] = await pool.query(
      `SELECT * FROM sesi_absensi_guru 
       WHERE id_pengguna=? AND id_sekolah=? AND tanggal=? AND waktu_pulang IS NULL`,
      [id_pengguna, id_sekolah, todayDate()]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: 'Belum ada sesi aktif untuk checkout' });
    }

    const id_sesi = rows[0].id_sesi;

    await pool.query( //melakukan update data checkout di database
      `UPDATE sesi_absensi_guru
       SET waktu_pulang = NOW()
       WHERE id_sesi = ?`,
      [id_sesi]
    );

    res.json({ message: 'Check-out berhasil', id_sesi });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal check-out' });
  }
};

// fungsi mendapatkan jadwal hari ini
exports.getJadwalHariIni = async (req, res) => {
  const { id_sekolah, hari } = req.query; // mengambil parameter id_sekolah dan hari 
  const id_pengguna = req.user.id_pengguna; //mengambil id_pengguna dari token pengguna yang login

  try {
    const [rows] = await pool.query( //menjalankan query ke database 
      `SELECT j.id_jadwal, j.jam_mulai, j.jam_selesai,
              k.nama_kelas, m.nama_mapel
       FROM jadwal_mengajar j
       JOIN pendaftaran_guru pg ON j.id_pendaftaran = pg.id_pendaftaran
       JOIN kelas k ON j.id_kelas = k.id_kelas
       JOIN mata_pelajaran m ON j.id_mapel = m.id_mapel
       WHERE pg.id_pengguna=? AND pg.id_sekolah=? AND j.hari=?`,
      [id_pengguna, id_sekolah, hari]
    );

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil jadwal hari ini' });
  }
};

// fungsi untuk mendapatkan semua jadwal
exports.getSemuaJadwal = async (req, res) => {
  const id_pengguna = req.user.id_pengguna;  

  try {
    const [rows] = await pool.query(
      `SELECT 
          j.id_jadwal,
          j.id_kelas AS id_kelas,
          j.hari,
          j.jam_mulai,
          j.jam_selesai,
          k.nama_kelas,
          k.tingkat,
          m.nama_mapel,
          s.nama_sekolah,
          pg.id_sekolah AS id_sekolah 
       FROM jadwal_mengajar j
       JOIN pendaftaran_guru pg ON j.id_pendaftaran = pg.id_pendaftaran
       JOIN kelas k ON j.id_kelas = k.id_kelas
       JOIN mata_pelajaran m ON j.id_mapel = m.id_mapel
       JOIN sekolah s ON pg.id_sekolah = s.id_sekolah
       WHERE pg.id_pengguna = ?
       ORDER BY 
          s.nama_sekolah,
          FIELD(j.hari, 'Senin','Selasa','Rabu','Kamis','Jumat','Sabtu','Minggu'),
          j.jam_mulai`,
      [id_pengguna]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Gagal mengambil semua jadwal mengajar' });
  }
};

// fungsi untuk melakukan absensi siswa (negatif)
exports.absensiSiswa = async (req, res) => { 
  const { id_sesi_guru, id_jadwal, tanggal, ketidakhadiran } = req.body; //mengambil data absensi dari body permintaan

  if (!Array.isArray(ketidakhadiran)) { //validasi format ketidakhadiran harus array
    return res.status(400).json({ message: 'Format ketidakhadiran tidak valid' }); //mengirim respons error jika bukan array
  }

  const conn = await pool.getConnection(); //mendapatkan koneksi database untuk transaksi
  try {
    await conn.beginTransaction(); //memulai transaksi database

    for (const item of ketidakhadiran) { //melakukan perulangan setiap data siswa
      const { id_siswa, status } = item; //mengambil id siswa dan status absensi dari item
      await conn.query( //menjalankan query untuk insert absensi siswa
        `INSERT INTO absensi_siswa (id_sesi_guru, id_jadwal, id_siswa, status, tanggal)
         VALUES (?, ?, ?, ?, ?)`,
        [id_sesi_guru, id_jadwal, id_siswa, status, tanggal]
      );
    }

    await conn.commit(); //commit transaksi jika semua query berhasil
    res.status(201).json({ message: 'Absensi siswa disimpan' });
  } catch (err) {//jika error
    await conn.rollback(); //membatalkan transaksi
    res.status(500).json({ message: 'Gagal menyimpan absensi siswa' });
  } finally {
    conn.release(); //melepas koneksi database
  }
};

//fungsi untuk menyimpan jurnal mengajar guru
exports.jurnalMengajar = async (req, res) => { 
  const { id_sesi_guru, id_jadwal, materi_diajarkan, catatan_kegiatan } = req.body; //mengambil data dari body permintaan

  try {
    await pool.query( //menjalankan query untuk menyimpan jurnal
      `INSERT INTO jurnal_mengajar 
       (id_sesi_guru, id_jadwal, materi_diajarkan, catatan_kegiatan)
       VALUES (?, ?, ?, ?)`, //query insert jurnal 
      [id_sesi_guru, id_jadwal, materi_diajarkan, catatan_kegiatan] //nilai-nilai yang diinput
    );

    res.status(201).json({ message: 'Jurnal mengajar disimpan' }); 
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan jurnal mengajar' });
  }
};

//fungsi untuk menyimpan catatan siswa
exports.catatanSiswa = async (req, res) => {
  const { id_sesi_guru, id_siswa, jenis_catatan, deskripsi } = req.body; //mengambil catatan dari body permintaan

  try {
    await pool.query( //menjalankan query untuk menyimpan catatan siswa
      `INSERT INTO catatan_siswa 
       (id_sesi_guru, id_siswa, jenis_catatan, deskripsi)
       VALUES (?, ?, ?, ?)`, //query insert catatan siswa
      [id_sesi_guru, id_siswa, jenis_catatan, deskripsi] //nilai-nilai yang disimpan
    );

    res.status(201).json({ message: 'Catatan siswa disimpan' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menyimpan catatan siswa' });
  }
};

// fungsi mengambil daftar siswa berdasarkan kelas
exports.getSiswaByKelas = async (req, res) => {
  const { id_kelas } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT id_siswa, nama_lengkap, nis
       FROM siswa
       WHERE id_kelas = ?
       ORDER BY nama_lengkap`,
      [id_kelas]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Gagal mengambil data siswa" });
  }
};

//fungsi report guru
exports.getReportGuru = async (req, res) => {
  const { start, end, id_sekolah, id_pengguna } = req.query;

  if (!start || !end) {
    return res.status(400).json({ message: "start dan end wajib diisi" });
  }

  const targetIdPengguna =
    req.user.peran === "admin"
      ? (id_pengguna ? Number(id_pengguna) : null)
      : req.user.id_pengguna;

  if (req.user.peran === "admin" && !targetIdPengguna) {
    return res.status(400).json({ message: "Admin wajib memilih guru (id_pengguna)" });
  }

  try {
    //absensi guru
    const [absensiGuru] = await pool.query(
      `
      SELECT 
        sag.id_sesi,
        sag.tanggal,
        sag.waktu_masuk,
        sag.waktu_pulang,
        sk.id_sekolah,
        sk.nama_sekolah
      FROM sesi_absensi_guru sag
      JOIN sekolah sk ON sag.id_sekolah = sk.id_sekolah
      WHERE sag.id_pengguna = ?
        AND sag.tanggal BETWEEN ? AND ?
        AND (? IS NULL OR sag.id_sekolah = ?)
      ORDER BY sag.tanggal DESC, sk.nama_sekolah
      `,
      [targetIdPengguna, start, end, id_sekolah || null, id_sekolah || null]
    );

    //jurnal kbm
    const [jurnal] = await pool.query(
      `
      SELECT 
        jm.id_jurnal,
        jm.timestamp,
        jm.materi_diajarkan,
        jm.catatan_kegiatan,
        sk.id_sekolah,
        sk.nama_sekolah,
        k.tingkat,
        k.nama_kelas,
        m.nama_mapel,
        j.hari,
        j.jam_mulai,
        j.jam_selesai
      FROM jurnal_mengajar jm
      JOIN sesi_absensi_guru sag ON jm.id_sesi_guru = sag.id_sesi
      JOIN sekolah sk ON sag.id_sekolah = sk.id_sekolah
      JOIN jadwal_mengajar j ON jm.id_jadwal = j.id_jadwal
      JOIN kelas k ON j.id_kelas = k.id_kelas
      JOIN mata_pelajaran m ON j.id_mapel = m.id_mapel
      WHERE sag.id_pengguna = ?
        AND DATE(jm.timestamp) BETWEEN ? AND ?
        AND (? IS NULL OR sag.id_sekolah = ?)
      ORDER BY jm.timestamp DESC, sk.nama_sekolah, k.nama_kelas
      `,
      [targetIdPengguna, start, end, id_sekolah || null, id_sekolah || null]
    );

    res.json({ absensiGuru, jurnal });
  } catch (err) {
    console.error("getReportGuru error:", err);
    res.status(500).json({ message: "Gagal mengambil report guru" });
  }
};

//fungsi report siswa
exports.getReportSiswa = async (req, res) => {
  const { start, end, id_sekolah, id_kelas, id_pengguna } = req.query;

  if (!start || !end) {
    return res.status(400).json({ message: "start dan end wajib diisi" });
  }

  const targetIdPengguna =
    req.user.peran === "admin"
      ? (id_pengguna ? Number(id_pengguna) : null)
      : req.user.id_pengguna;

  if (req.user.peran === "admin" && !targetIdPengguna) {
    return res.status(400).json({ message: "Admin wajib memilih guru (id_pengguna)" });
  }

  try {
    // absensi siswa
    const [absensi] = await pool.query(
      `
      SELECT 
        a.id_absensi_siswa,
        a.tanggal,
        a.status,
        s.id_siswa,
        s.nama_lengkap,
        s.nis,
        k.id_kelas,
        k.nama_kelas,
        k.tingkat,
        sk.id_sekolah,
        sk.nama_sekolah,
        m.nama_mapel,
        j.jam_mulai,
        j.jam_selesai
      FROM absensi_siswa a
      JOIN siswa s ON a.id_siswa = s.id_siswa
      JOIN jadwal_mengajar j ON a.id_jadwal = j.id_jadwal
      JOIN kelas k ON j.id_kelas = k.id_kelas
      JOIN mata_pelajaran m ON j.id_mapel = m.id_mapel
      JOIN sesi_absensi_guru sag ON a.id_sesi_guru = sag.id_sesi
      JOIN sekolah sk ON sag.id_sekolah = sk.id_sekolah
      WHERE sag.id_pengguna = ?
        AND a.tanggal BETWEEN ? AND ?
        AND (? IS NULL OR sag.id_sekolah = ?)
        AND (? IS NULL OR j.id_kelas = ?)
      ORDER BY a.tanggal DESC, sk.nama_sekolah, k.nama_kelas, s.nama_lengkap
      `,
      [
        targetIdPengguna,
        start,
        end,
        id_sekolah || null,
        id_sekolah || null,
        id_kelas || null,
        id_kelas || null,
      ]
    );

    //catatan siswa
    const [catatan] = await pool.query(
      `
      SELECT
        c.id_catatan,
        c.timestamp,
        c.jenis_catatan,
        c.deskripsi,
        s.id_siswa,
        s.nama_lengkap,
        s.nis,
        k.id_kelas,
        k.nama_kelas,
        k.tingkat,
        sk.id_sekolah,
        sk.nama_sekolah
      FROM catatan_siswa c
      JOIN siswa s ON c.id_siswa = s.id_siswa
      JOIN sesi_absensi_guru sag ON c.id_sesi_guru = sag.id_sesi
      JOIN sekolah sk ON sag.id_sekolah = sk.id_sekolah
      LEFT JOIN kelas k ON s.id_kelas = k.id_kelas
      WHERE sag.id_pengguna = ?
        AND DATE(c.timestamp) BETWEEN ? AND ?
        AND (? IS NULL OR sag.id_sekolah = ?)
        AND (? IS NULL OR s.id_kelas = ?)
      ORDER BY c.timestamp DESC, sk.nama_sekolah, k.nama_kelas, s.nama_lengkap
      `,
      [
        targetIdPengguna,
        start,
        end,
        id_sekolah || null,
        id_sekolah || null,
        id_kelas || null,
        id_kelas || null,
      ]
    );

    res.json({ absensi, catatan });
  } catch (err) {
    console.error("getReportSiswa error:", err);
    res.status(500).json({ message: "Gagal mengambil report siswa" });
  }
};

//fungsi mengambil kelas berdasarkan sekolah
exports.getKelasBySekolah = async (req, res) => {
  const id_pengguna = req.user.id_pengguna;
  const { id_sekolah } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT DISTINCT
        k.id_kelas,
        k.nama_kelas,
        k.tingkat
      FROM jadwal_mengajar j
      JOIN pendaftaran_guru pg ON j.id_pendaftaran = pg.id_pendaftaran
      JOIN kelas k ON j.id_kelas = k.id_kelas
      WHERE pg.id_pengguna = ?
        AND pg.id_sekolah = ?
      ORDER BY k.tingkat, k.nama_kelas
      `,
      [id_pengguna, id_sekolah]
    );

    res.json(rows);
  } catch (err) {
    console.error("getKelasBySekolah error:", err);
    res.status(500).json({ message: "Gagal mengambil kelas berdasarkan sekolah" });
  }
};


// fungsi mengambil presensi guru hari ini
exports.getPresensiHariIni = async (req, res) => {
  const id_pengguna = req.user.id_pengguna;
  const tanggal = req.query.tanggal || todayDate();

  try {
    const [rows] = await pool.query(
      `SELECT id_sesi, id_sekolah, tanggal, waktu_masuk, waktu_pulang
       FROM sesi_absensi_guru
       WHERE id_pengguna = ? AND tanggal = ?
       ORDER BY waktu_masuk DESC`,
      [id_pengguna, tanggal]
    );

    const bySchool = {};
    for (const r of rows) {
      bySchool[String(r.id_sekolah)] = {
        id_sesi: r.id_sesi,
        tanggal: dayjs(r.tanggal).format("YYYY-MM-DD"),
        waktu_masuk: r.waktu_masuk,
        waktu_pulang: r.waktu_pulang,
      };
    }

    res.json({ bySchool });
  } catch (err) {
    console.error("getPresensiHariIni error:", err);
    res.status(500).json({ message: "Gagal mengambil presensi hari ini" });
  }
};


// fungsi mengambil daftar jadwal yang sudah "selesai" hari ini
exports.getJadwalSelesaiHariIni = async (req, res) => {
  const id_pengguna = req.user.id_pengguna;
  const tanggal = req.query.tanggal || todayDate();

  try {
    const [rows] = await pool.query(
      `SELECT jm.id_jadwal, DATE(jm.timestamp) AS tanggal
       FROM jurnal_mengajar jm
       JOIN sesi_absensi_guru sag ON jm.id_sesi_guru = sag.id_sesi
       WHERE sag.id_pengguna = ?
         AND DATE(jm.timestamp) = ?
       GROUP BY jm.id_jadwal`,
      [id_pengguna, tanggal]
    );

    const byJadwal = {};
    for (const r of rows) {
      byJadwal[String(r.id_jadwal)] = {
        tanggal: dayjs(r.tanggal).format("YYYY-MM-DD"),
        selesai: true,
      };
    }

    res.json({ byJadwal });
  } catch (err) {
    console.error("getJadwalSelesaiHariIni error:", err);
    res.status(500).json({ message: "Gagal mengambil status selesai hari ini" });
  }
};

// fungsi mengambil daftar sekolah berdasarkan guru
exports.getSekolahByGuru = async (req, res) => {
  const { id_pengguna } = req.params;

  try {
    const [rows] = await pool.query(
      `
      SELECT DISTINCT
        sk.id_sekolah,
        sk.nama_sekolah
      FROM pendaftaran_guru pg
      JOIN sekolah sk ON pg.id_sekolah = sk.id_sekolah
      WHERE pg.id_pengguna = ?
      ORDER BY sk.nama_sekolah
      `,
      [id_pengguna]
    );

    res.json(rows);
  } catch (err) {
    console.error("getSekolahByGuru error:", err);
    res.status(500).json({ message: "Gagal mengambil sekolah guru" });
  }
};


