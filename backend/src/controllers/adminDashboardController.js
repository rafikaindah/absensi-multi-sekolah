const pool = require("../config/db");
const dayjs = require("dayjs");

const todayDate = () => dayjs().format("YYYY-MM-DD");

//mengambil ringkasan total data (sekolah, kelas, siswa, guru)
exports.getSummary = async (req, res) => {
  try {
    const [[sekolah]] = await pool.query(`SELECT COUNT(*) AS total FROM sekolah`);
    const [[kelas]] = await pool.query(`SELECT COUNT(*) AS total FROM kelas`);
    const [[siswa]] = await pool.query(`SELECT COUNT(*) AS total FROM siswa`);
    const [[guru]] = await pool.query(`SELECT COUNT(*) AS total FROM pengguna WHERE peran='guru'`);

    res.json({
      sekolah: sekolah.total || 0,
      kelas: kelas.total || 0,
      siswa: siswa.total || 0,
      guru: guru.total || 0,
    });
  } catch (err) {
    console.error("getSummary error:", err);
    res.status(500).json({ message: "Gagal mengambil summary dashboard" });
  }
};

//mengambil presensi guru hari ini (total guru, hadir, belum check-in)
exports.getTodayPresensiGuru = async (req, res) => {
  const tanggal = req.query.tanggal || todayDate();

  try {
    //total guru
    const [[guru]] = await pool.query(`SELECT COUNT(*) AS total FROM pengguna WHERE peran='guru'`);

    //hadir = guru yang punya sesi absensi hari ini 
    const [[hadir]] = await pool.query(
      `
      SELECT COUNT(DISTINCT sag.id_pengguna) AS total
      FROM sesi_absensi_guru sag
      WHERE sag.tanggal = ?
      `,
      [tanggal]
    );

    //guru yang belum check-in
    const totalGuru = guru.total || 0;
    const totalHadir = hadir.total || 0;
    const totalBelum = Math.max(totalGuru - totalHadir, 0);

    res.json({
      tanggal,
      totalGuru,
      hadir: totalHadir,
      belumCheckin: totalBelum,
    });
  } catch (err) {
    console.error("getTodayPresensiGuru error:", err);
    res.status(500).json({ message: "Gagal mengambil presensi guru hari ini" });
  }
};

//mengambil rekap absensi siswa hari ini (sakit, izin, alpa)
exports.getTodayAbsensiSiswa = async (req, res) => {
  const tanggal = req.query.tanggal || todayDate();

  try {
    //total status absensi siswa per hari
    const [[row]] = await pool.query(
      `
      SELECT
        SUM(CASE WHEN a.status='Sakit' THEN 1 ELSE 0 END) AS sakit,
        SUM(CASE WHEN a.status='Izin' THEN 1 ELSE 0 END) AS izin,
        SUM(CASE WHEN a.status='Alpa' THEN 1 ELSE 0 END) AS alpa
      FROM absensi_siswa a
      WHERE a.tanggal = ?
      `,
      [tanggal]
    );

    res.json({
      tanggal,
      sakit: Number(row?.sakit || 0),
      izin: Number(row?.izin || 0),
      alpa: Number(row?.alpa || 0),
    });
  } catch (err) {
    console.error("getTodayAbsensiSiswa error:", err);
    res.status(500).json({ message: "Gagal mengambil absensi siswa hari ini" });
  }
};
