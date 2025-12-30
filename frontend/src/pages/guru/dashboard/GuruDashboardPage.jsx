import { useOutletContext, useNavigate } from "react-router-dom";
import { useGuruDashboardController } from "./guruDashboard.controller";
import "./GuruDashboardPage.css";
import QrScannerModal from "../../../components/QrScannerModal";

export default function GuruDashboardPage() {
  const { toggleSidebar } = useOutletContext();
  const nav = useNavigate();
  const c = useGuruDashboardController();

  return (
    <div className="gpage">
      {/* modal scan QR */}
      <QrScannerModal
        open={c.scanOpen} 
        onClose={() => c.setScanOpen(false)} 
        title={c.scanMode === "checkout" ? "Scan QR untuk Check-out" : "Scan QR untuk Check-in"} 
        onScan={c.onScanQr} 
      />
      {/* Header halaman */}
      <div className="gpage-header">
        <div className="gtitle-row">
          {/* tombol hamburger */}
          <button
            className="ghamburger"
            onClick={toggleSidebar}
            aria-label="Buka / tutup menu"
          >
            ☰
          </button>

          {/* judul + info hari/tanggal */}
          <div>
            <h1>Dashboard Guru</h1>
            <div className="gsub">
              Hari/Tanggal: {c.hariIni}, {c.tanggalIni}
            </div>
          </div>
        </div>
      </div>

      {/* jika error, tampilkan kotak merah */}
      {c.error && <div className="galert">{c.error}</div>}

      <div className="ggrid">
        {/* card presensi guru */}
        <div className="gcard">
          <div className="gcard-head">
            <h2>Presensi Guru Hari Ini</h2>
          </div>

          {/* tombol check-in dan check-out */}
          <div className="gbtn-row">
            <button className="gprimary" onClick={c.handleCheckin}>
              Check-in
            </button>
            <button className="gbtn" onClick={c.handleCheckout}>
              Check-out
            </button>
          </div>
        </div>

        {/* card jadwal hari ini */}
        <div className="gcard">
          <div className="gcard-head">
            <h2>Jadwal Hari Ini</h2>
          </div>

          {/* kondisi loading */}
          {c.loading ? (
            <div className="gstate">Memuat jadwal...</div>
          ) : c.jadwalHariIni.length === 0 ? (
            //jika jadwal kosong
            <div className="gstate">Tidak ada jadwal hari ini.</div>
          ) : (
            //jika ada jadwal
            <div className="gschedule">
              {c.jadwalHariIni.map((j) => {
                const ok = c.canMulaiMengajar(j);
                const st = c.getStatusJadwal(j);

                return (
                  <div className="gschedule-item" key={j.id_jadwal}>
                    {/* jam pelajaran */}
                    <div className="gtime">
                      {j.jam_mulai} - {j.jam_selesai}
                    </div>

                    {/* info detail jadwal */}
                    <div className="gmeta">
                      <div><b>Mapel:</b> {j.nama_mapel}</div>
                      <div><b>Kelas:</b> {j.tingkat}{j.nama_kelas}</div>
                      <div><b>Sekolah:</b> {j.nama_sekolah}</div>

                      {/* status presensi */}
                      <div className={`gstatus ${st.tone}`}>
                        {st.text}
                      </div>
                    </div>

                    {/* tombol mulai mengajar */}
                    <button
                      className={`gprimary ${ok ? "" : "disabled"}`}
                      disabled={!ok}
                      onClick={() => nav(`/guru/mulai/${j.id_jadwal}`)}
                      title={!ok ? "Presensi dulu / jadwal sudah selesai" : "Mulai mengajar"}
                    >
                      Mulai Mengajar
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
