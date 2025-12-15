import { useOutletContext, useNavigate } from "react-router-dom";
import { useGuruDashboardController } from "./guruDashboard.controller";
import "./GuruDashboardPage.css";

export default function GuruDashboardPage() {
  const { toggleSidebar } = useOutletContext();
  const nav = useNavigate();
  const c = useGuruDashboardController();

  return (
    <div className="gpage">
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
            <h1>Dashboard Guru (Multi Sekolah)</h1>
            <div className="gsub">
              Hari: {c.hariIni} Tanggal: {c.tanggalIni}
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
            <div className="ghint">Mode manual</div>
          </div>

          {/* input id_sekolah untuk check-in/check-out */}
          <div className="gform-row">
            <label>id_sekolah</label>
            <input
              value={c.presensiForm.id_sekolah}
              onChange={(e) => c.onChangePresensi("id_sekolah", e.target.value)}
              placeholder="Contoh: 1"
            />
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

          {/* menampilkan sekolah yang sedang aktif */}
          <div className="gmini">
            Sekolah aktif: <b>{c.activeSchool ? `ID ${c.activeSchool}` : "-"}</b>
          </div>
        </div>

        {/* card jadwal hari ini */}
        <div className="gcard">
          <div className="gcard-head">
            <h2>Jadwal Hari Ini</h2>
            <div className="ghint">
              Tombol “Mulai Mengajar” aktif jika sudah presensi sekolahnya.
            </div>
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

                return (
                  <div className="gschedule-item" key={j.id_jadwal}>
                    {/* jam pelajaran */}
                    <div className="gtime">
                      {j.jam_mulai} - {j.jam_selesai}
                    </div>

                    {/* info detail jadwal */}
                    <div className="gmeta">
                      <div><b>Mapel:</b> {j.nama_mapel}</div>
                      <div><b>Kelas:</b> {j.nama_kelas}</div>
                      <div><b>Sekolah:</b> {j.nama_sekolah}</div>

                      {/* status presensi */}
                      <div className={`gstatus ${ok ? "ok" : "warn"}`}>
                        {ok ? "PRESENSI AKTIF " : "BELUM PRESENSI "}
                      </div>
                    </div>

                    {/* tombol mulai mengajar */}
                    <button
                      className={`gprimary ${ok ? "" : "disabled"}`}
                      disabled={!ok}
                      onClick={() => nav(`/guru/mulai/${j.id_jadwal}`)}
                      title={!ok ? "Presensi dulu di sekolah ini" : "Mulai mengajar"}
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

      {/* card menu cepat */}
      <div className="gcard">
        <div className="gcard-head">
          <h2>Menu Utama</h2>
        </div>

        {/* tombol shortcut ke halaman-halaman utama */}
        <div className="gquick">
          <button className="gbtn" onClick={() => nav("/guru/jurnal-kbm")}>
            Jurnal KBM
          </button>
          <button className="gbtn" onClick={() => nav("/guru/absensi-siswa")}>
            Absensi Siswa
          </button>
          <button className="gbtn" onClick={() => nav("/guru/kedisiplinan")}>
            Kedisiplinan
          </button>
          <button className="gbtn" onClick={() => nav("/guru/rekap-presensi")}>
            Rekap Presensi
          </button>
        </div>
      </div>
    </div>
  );
}
