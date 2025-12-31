import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { adminDashboardApi } from "../../../api/adminDashboardApi";
import "./AdminDashboardPage.css";

export default function AdminDashboardPage() {
  const { toggleSidebar } = useOutletContext(); 

  //state loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //state data ringkasan dashboard
  const [summary, setSummary] = useState({ sekolah: 0, guru: 0, siswa: 0, kelas: 0 });
  const [presensi, setPresensi] = useState({ hadir: 0, belumCheckin: 0, totalGuru: 0 });
  const [absensiSiswa, setAbsensiSiswa] = useState({ sakit: 0, izin: 0, alpa: 0 });

  //mengambil semua data dashboard (summary + presensi guru + absensi siswa)
  const fetchAll = async () => {
    try {
      setLoading(true);
      setError("");

      const [a, b, c] = await Promise.all([
        adminDashboardApi.summary(),
        adminDashboardApi.todayPresensiGuru(),
        adminDashboardApi.todayAbsensiSiswa(),
      ]);

      setSummary(a.data || { sekolah: 0, guru: 0, siswa: 0, kelas: 0 });
      setPresensi(b.data || { hadir: 0, belumCheckin: 0, totalGuru: 0 });
      setAbsensiSiswa(c.data || { sakit: 0, izin: 0, alpa: 0 });
    } catch (e) {
      setError(e.response?.data?.message || "Gagal memuat dashboard admin");
    } finally {
      setLoading(false);
    }
  };

  //load pertama kali halaman dibuka
  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="adash">
      {/* header (hamburger + judul + tombol refresh) */}
      <div className="adash-head">
        <button className="adash-hamburger" onClick={toggleSidebar}>☰</button>
        <div>
          <h1 className="adash-title">Dashboard Admin</h1>
        </div>

        {/* tombol refresh data dashboard */}
        <button className="adash-refresh" onClick={fetchAll} disabled={loading}>
          {loading ? "Memuat..." : "Refresh"}
        </button>
      </div>

      {/* pesan error */}
      {error && <div className="adash-alert">{error}</div>}

      {/* grid card ringkasan */}
      <div className="adash-grid">
        {/* card jumlah sekolah */}
        <div className="adash-card">
          <div className="adash-label">Jumlah Sekolah</div>
          <div className="adash-value">{loading ? "…" : summary.sekolah}</div>
        </div>

        {/* card jumlah guru */}
        <div className="adash-card">
          <div className="adash-label">Jumlah Guru</div>
          <div className="adash-value">{loading ? "…" : summary.guru}</div>
        </div>

        {/* card jumlah siswa */}
        <div className="adash-card">
          <div className="adash-label">Jumlah Siswa</div>
          <div className="adash-value">{loading ? "…" : summary.siswa}</div>
        </div>

        {/* card jumlah kelas */}
        <div className="adash-card">
          <div className="adash-label">Jumlah Kelas</div>
          <div className="adash-value">{loading ? "…" : summary.kelas}</div>
        </div>

        {/* card presensi guru hari ini */}
        <div className="adash-card">
          <div className="adash-label">Presensi Guru Hari Ini</div>
          <div className="adash-value">
            {loading ? "…" : `${presensi.hadir} hadir`}
          </div>
          <div className="adash-meta">
            {loading ? "" : `Total ${presensi.totalGuru}`}
          </div>
        </div>

        {/* card absensi siswa hari ini */}
        <div className="adash-card">
          <div className="adash-label">Absensi Siswa Hari Ini</div>
          <div className="adash-value">
            {loading ? "…" : `${absensiSiswa.sakit + absensiSiswa.izin + absensiSiswa.alpa} siswa`}
          </div>
          <div className="adash-meta">
            {loading ? "" : `Sakit: ${absensiSiswa.sakit}  Izin: ${absensiSiswa.izin}  Alpa: ${absensiSiswa.alpa}`}
          </div>
        </div>
      </div>
    </div>
  );
}
