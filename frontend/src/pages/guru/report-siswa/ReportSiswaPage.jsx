import { useOutletContext } from "react-router-dom";
import { useReportSiswaController } from "./reportSiswa.controller";
import "../Report.css";

export default function ReportSiswaPage() {
  const { toggleSidebar } = useOutletContext();
  const c = useReportSiswaController();

  return (
    <div className="rpage">
      {/* header (judul halaman + tombol hamburger sidebar) */}
      <div className="rhead">
        <button className="rhamburger" onClick={toggleSidebar}>☰</button>
        <div>
          <h1>Report Siswa</h1>
        </div>
      </div>

      {/* pesan error */}
      {c.error && <div className="ralert">{c.error}</div>}

      {/* card (start, end, sekolah, kelas + tombol terapkan filter) */}
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

          {/* filter kelas (aktif jika sekolah dipilih) */}
          <div className="rfield">
            <label>Kelas</label>
            <select
              value={c.filter.id_kelas}
              onChange={(e) => c.onChange("id_kelas", e.target.value)}
              disabled={!c.filter.id_sekolah}
            >
              <option value="">Semua Kelas</option>
              {c.kelasList.map((k) => (
                <option key={k.id_kelas} value={k.id_kelas}>
                  {k.tingkat ? `${k.tingkat}-` : ""}{k.nama_kelas}
                </option>
              ))}
            </select>
          </div>

          {/* tombol terapkan filter */}
          <button className="rprimary" onClick={c.fetchData} disabled={c.loading}>
            {c.loading ? "Memuat..." : "Terapkan Filter"}
          </button>
        </div>

        {/* ringkasan status absensi */}
        <div className="rstats">
          <div className="rstat">Sakit: <b>{c.stats.Sakit}</b></div>
          <div className="rstat">Izin: <b>{c.stats.Izin}</b></div>
          <div className="rstat">Alpa: <b>{c.stats.Alpa}</b></div>
        </div>
      </div>

      {/* card absensi siswa */}
      <div className="rcard">
        <h2>Absensi Siswa</h2>

        {c.loading ? (
          <div className="rstate">Memuat...</div>
        ) : c.groupedAbsensi.length === 0 ? (
          <div className="rstate">Tidak ada data.</div>
        ) : (
          c.groupedAbsensi.map((g) => (
            <div className="rgroup" key={g.nama_sekolah}>
              <div className="rgroup-title">Sekolah: {g.nama_sekolah}</div>

              {g.kelas.map((k) => (
                <div className="rgroup" key={`${g.nama_sekolah}-${k.nama_kelas}`}>
                  <div className="rgroup-title">Kelas: {k.nama_kelas}</div>

                  <div className="rtablewrap">
                    <table className="rtable">
                      <thead>
                        <tr>
                          <th>Tanggal</th>
                          <th>NIS</th>
                          <th>Nama Lengkap</th>
                          <th>Mapel</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {k.rows.map((a) => (
                          <tr key={a.id_absensi_siswa}>
                            <td>{a.tanggal_fmt}</td>
                            <td>{a.nis}</td>
                            <td>{a.nama_lengkap || "-"}</td>
                            <td>{a.nama_mapel || "-"}</td>
                            <td>{a.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      {/* card catatan siswa */}
      <div className="rcard">
        <h2>Catatan Siswa</h2>

        {c.loading ? (
          <div className="rstate">Memuat...</div>
        ) : c.groupedCatatan.length === 0 ? (
          <div className="rstate">Tidak ada data.</div>
        ) : (
          c.groupedCatatan.map((g) => (
            <div className="rgroup" key={g.nama_sekolah}>
              <div className="rgroup-title">Sekolah: {g.nama_sekolah}</div>

              {g.kelas.map((k) => (
                <div className="rgroup" key={`${g.nama_sekolah}-${k.nama_kelas}`}>
                  <div className="rgroup-title">Kelas: {k.nama_kelas}</div>

                  <div className="rtablewrap">
                    <table className="rtable">
                      <thead>
                        <tr>
                          <th>Tanggal</th>
                          <th>NIS</th>
                          <th>Nama Lengkap</th>
                          <th>Jenis</th>
                          <th>Deskripsi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {k.rows.map((x) => (
                          <tr key={x.id_catatan}>
                            <td>{x.waktu_fmt}</td>
                            <td>{x.nis}</td>
                            <td>{x.nama_lengkap || "-"}</td>
                            <td>{x.jenis_catatan}</td>
                            <td className="rdesc">{x.deskripsi}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
