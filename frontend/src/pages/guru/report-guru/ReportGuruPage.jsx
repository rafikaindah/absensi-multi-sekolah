import { useOutletContext } from "react-router-dom";
import { useReportGuruController } from "./reportGuru.controller";
import "../Report.css";

export default function ReportGuruPage() {
  const { toggleSidebar } = useOutletContext();
  const c = useReportGuruController();

  return (
    <div className="rpage">
      {/* header (judul halaman + tombol hamburger sidebar) */}
      <div className="rhead">
        <button className="rhamburger" onClick={toggleSidebar}>☰</button>
        <div>
          <h1>Report Guru</h1>
        </div>
      </div>

      {/* pesan error */}
      {c.error && <div className="ralert">{c.error}</div>}

      {/* card (start, end, sekolah + tombol terapkan filter) */}
      <div className="rcard">
        <div className="rfilters">
          {/* filter start date */}
          <div className="rfield">
            <label>Start</label>
            <input
              type="date"
              value={c.filter.start}
              onChange={(e) => c.onChange("start", e.target.value)}
            />
          </div>

          {/* filter end date */}
          <div className="rfield">
            <label>End</label>
            <input
              type="date"
              value={c.filter.end}
              onChange={(e) => c.onChange("end", e.target.value)}
            />
          </div>

          {/* filter sekolah */}
          <div className="rfield">
            <label>Sekolah</label>
            <select
              value={c.filter.id_sekolah}
              onChange={(e) => c.onChange("id_sekolah", e.target.value)}
            >
              <option value="">Semua Sekolah</option>
              {c.sekolahList.map((s) => (
                <option key={s.id_sekolah} value={s.id_sekolah}>
                  {s.nama_sekolah}
                </option>
              ))}
            </select>
          </div>

          {/* tombol terapkan filter */}
          <button className="rprimary" onClick={c.fetchData} disabled={c.loading}>
            {c.loading ? "Memuat..." : "Terapkan Filter"}
          </button>
        </div>
      </div>

      {/* card absensi guru */}
      <div className="rcard">
        <h2>Absensi Guru</h2>

        {c.loading ? (
          <div className="rstate">Memuat...</div>
        ) : c.groupedAbsensi.length === 0 ? (
          <div className="rstate">Tidak ada data.</div>
        ) : (
          c.groupedAbsensi.map((g) => (
            <div className="rgroup" key={g.nama_sekolah}>
              <div className="rgroup-title">{g.nama_sekolah}</div>

              <div className="rtablewrap">
                <table className="rtable">
                  <thead>
                    <tr>
                      <th style={{ width: 140 }}>Tanggal</th>
                      <th>Masuk</th>
                      <th>Pulang</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((x) => (
                      <tr key={x.id_sesi}>
                        <td>{x.tanggal_fmt}</td>
                        <td>{x.masuk_fmt}</td>
                        <td>{x.pulang_fmt}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>

      {/* card jurnal kbm */}
      <div className="rcard">
        <h2>Jurnal KBM</h2>

        {c.loading ? (
          <div className="rstate">Memuat...</div>
        ) : c.groupedJurnal.length === 0 ? (
          <div className="rstate">Tidak ada data.</div>
        ) : (
          c.groupedJurnal.map((g) => (
            <div className="rgroup" key={g.nama_sekolah}>
              <div className="rgroup-title">{g.nama_sekolah}</div>

              <div className="rtablewrap">
                <table className="rtable">
                  <thead>
                    <tr>
                      <th style={{ width: 170 }}>Tanggal</th>
                      <th>Kelas</th>
                      <th>Mapel</th>
                      <th>Materi</th>
                      <th>Catatan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.rows.map((j) => (
                      <tr key={j.id_jurnal}>
                        <td>{j.waktu_fmt}</td>
                        <td>{j.nama_kelas}</td>
                        <td>{j.nama_mapel}</td>
                        <td className="rdesc">{j.materi_diajarkan || "-"}</td>
                        <td className="rdesc">{j.catatan_kegiatan || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
