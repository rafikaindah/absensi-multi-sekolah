import { useEffect, useMemo, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import QRCode from "qrcode";
import { masterApi } from "../../../api/masterApi";
import { adminQrApi } from "../../../api/adminQrApi";
import "./AdminQrSekolahPage.css";

export default function AdminQrSekolahPage() {
  const { toggleSidebar } = useOutletContext();

  //state list sekolah + sekolah terpilih uuid
  const [sekolahList, setSekolahList] = useState([]);
  const [uuid, setUuid] = useState("");

  //state QR + metadata dari backend
  const [qrPng, setQrPng] = useState("");
  const [meta, setMeta] = useState(null);

  //state loading dan error
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //ref untuk menyimpan interval refresh
  const timerRef = useRef(null);

  //mengambil data sekolah yang sedang dipilih (untuk menampilkan nama sekolah)
  const selectedSekolah = useMemo(() => {
    return sekolahList.find((s) => String(s.uuid) === String(uuid));
  }, [sekolahList, uuid]);

  //fetch list sekolah untuk dropdown
  const fetchSekolah = async () => {
    try {
      const res = await masterApi.getSekolah();
      setSekolahList(
        (res.data || []).map((s) => ({
          id_sekolah: String(s.id_sekolah),
          uuid: String(s.uuid),
          nama_sekolah: s.nama_sekolah,
        }))
      );
    } catch {
      setSekolahList([]);
    }
  };

  //render teks QR menjadi gambar PNG
  const renderQr = async (text) => {
    const dataUrl = await QRCode.toDataURL(text, {
      margin: 1,
      width: 420,
      errorCorrectionLevel: "M",
    });
    setQrPng(dataUrl);
  };

  //ambil payload QR dari backend lalu render menjadi gambar
  const refreshQr = async (schoolUuid) => {
    if (!schoolUuid) return;

    try {
      setLoading(true);
      setError("");

      const res = await adminQrApi.getQrSekolah(schoolUuid);
      setMeta(res.data);

      await renderQr(res.data.qr_text);
    } catch (e) {
      setError(e.response?.data?.message || "Gagal membuat QR");
      setMeta(null);
      setQrPng("");
    } finally {
      setLoading(false);
    }
  };

  //load pertama kali: mengambil list sekolah + bersihkan timer saat unmount
  useEffect(() => {
    fetchSekolah();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  //jika sekolah berubah: generate QR + pasang auto refresh
  useEffect(() => {
    if (!uuid) return;

    //generate QR pertama kali saat sekolah dipilih
    refreshQr(uuid);

    //reset interval sebelumnya
    if (timerRef.current) clearInterval(timerRef.current);

    //auto refresh QR tiap 5 detik 
    timerRef.current = setInterval(() => {
      refreshQr(uuid);
    }, 5000);

    //cleanup saat uuid berubah / komponen unmount
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [uuid]);

  //hitung sisa detik sebelum QR expire
  const remainSec = useMemo(() => {
    if (!meta?.expires_at) return 0;
    const now = Math.floor(Date.now() / 1000);
    return Math.max(0, meta.expires_at - now);
  }, [meta]);

  return (
    <div className="aqr-page">
      {/* header (hamburger + judul + tombol refresh) */}
      <div className="aqr-headbar">
        {/* tombol hamburger */}
        <button className="adash-hamburger" onClick={toggleSidebar}>☰</button>

         {/* judul halaman */}
        <div>
          <h1 className="aqr-title">QR Sekolah</h1>
        </div>

        {/* tombol refresh */}
        <button
          className="aqr-refresh"
          disabled={!uuid || loading}
          onClick={() => refreshQr(uuid)}
        >
          {loading ? "Memuat..." : "Refresh"}
        </button>
      </div>

      {/* pesan error */}
      {error && <div className="aqr-alert">{error}</div>}

      {/* card utama */}
      <div className="aqr-card">
        {/* baris filter: pilih sekolah */}
        <div className="aqr-row">
          <div className="aqr-field">
            <label>Pilih Sekolah</label>
            <select value={uuid} onChange={(e) => setUuid(e.target.value)}>
              <option value="">-- pilih sekolah --</option>
              {sekolahList.map((s) => (
                <option key={s.uuid} value={s.uuid}>
                  {s.nama_sekolah}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* body: info (kiri) + tampilan QR (kanan) */}
        <div className="aqr-body">
          <div className="aqr-left">
            {/* nama sekolah terpilih */}
            <div className="aqr-title2">
              Sekolah: <b>{selectedSekolah?.nama_sekolah || "-"}</b>
            </div>

            {/* expire QR */}
            <div className="aqr-mini">
              Expire dalam: <b>{remainSec ? `${remainSec}s` : "-"}</b>
            </div>
          </div>

          <div className="aqr-right">
             {/* gambar QR, jika belum tampil placeholder */}
            {qrPng ? (
              <img className="aqr-img" src={qrPng} alt="QR Sekolah" />
            ) : (
              <div className="aqr-empty">Pilih sekolah</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
