const crypto = require("crypto");
const pool = require("../config/db");

//membulatkan waktu ke slot 10 menit
const slot10m = (t) => Math.floor(t / 600) * 600;

//membuat signature (HMAC) untuk validasi QR
const sign = (uuid, ts) =>
  crypto.createHmac("sha256", process.env.QR_SECRET)
    .update(`${uuid}.${ts}`)
    .digest("hex")
    .slice(0, 16);

//verifikasi QR sekolah dan mengembalikan data sekolah jika valid
exports.verifySchoolQr = async (qr_payload) => {
  const payload = JSON.parse(qr_payload);
  const { type, uuid, ts, sig } = payload;

  //tipe QR harus "school"
  if (type !== "school") throw new Error("QR tidak valid");

  //expired QR hanya valid untuk slot 10 menit sekarang/sebelumnya
  const now = Math.floor(Date.now() / 1000);
  const allowed = [slot10m(now), slot10m(now) - 600];
  if (!allowed.includes(ts)) throw new Error("QR kadaluarsa");

  //cek signature
  if (sign(uuid, ts) !== sig) throw new Error("QR tidak sah");

  //cek uuid sekolah ada di database
  const [rows] = await pool.query(
    "SELECT id_sekolah, nama_sekolah FROM sekolah WHERE uuid=?",
    [uuid]
  );
  if (!rows.length) throw new Error("Sekolah tidak ditemukan");

  return rows[0];//mengmbalikan data sekolah yang valid
};
