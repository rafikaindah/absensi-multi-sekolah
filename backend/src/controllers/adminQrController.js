const pool = require("../config/db");
const crypto = require("crypto");

//membulatkan waktu ke slot 10 menit
const slot10m = (epochSec) => Math.floor(epochSec / 600) * 600;

//membuat signature (HMAC) untuk validasi QR
const sign = (uuid, ts) => {
  const secret = process.env.QR_SECRET || process.env.JWT_SECRET; 
  return crypto
    .createHmac("sha256", secret)
    .update(`${uuid}.${ts}`)
    .digest("hex")
    .slice(0, 16); 
};

//generate QR sekolah berdasarkan uuid sekolah
exports.getQrSekolah = async (req, res) => {
  const { uuid } = req.params;

  try {
    //mengambil data sekolah berdasarkan uuid 
    const [rows] = await pool.query(
      "SELECT id_sekolah, uuid, nama_sekolah FROM sekolah WHERE uuid = ? LIMIT 1",
      [uuid]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Sekolah tidak ditemukan" });
    }

    const sekolah = rows[0];

    //membuat timestamp slot 10 menit + waktu kadaluarsa 
    const now = Math.floor(Date.now() / 1000);
    const ts = slot10m(now);
    const expiresAt = ts + 600; 

    //payload QR (isi data yang akan discan) 
    const payloadObj = {
      type: "school", //jenis QR
      uuid: sekolah.uuid, //uuid sekolah
      ts, //timestamp slot
      sig: sign(sekolah.uuid, ts), //signature untuk verifikasi
    };

    const qr_text = JSON.stringify(payloadObj);

    res.json({
      sekolah: {
        id_sekolah: sekolah.id_sekolah,
        uuid: sekolah.uuid,
        nama_sekolah: sekolah.nama_sekolah,
      },
      ts,
      expires_at: expiresAt,
      qr_text, 
      payload: payloadObj,
    });
  } catch (err) {
    console.error("getQrSekolah error:", err);
    res.status(500).json({ message: "Gagal membuat QR sekolah" });
  }
};
