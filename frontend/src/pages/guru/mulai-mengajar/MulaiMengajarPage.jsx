import { useOutletContext } from "react-router-dom";
import { useMulaiMengajarController } from "./mulaiMengajar.controller";
import "./MulaiMengajarPage.css";

export default function MulaiMengajarPage() {
  const { toggleSidebar } = useOutletContext();
  const c = useMulaiMengajarController();

  // tampilan saat loading
  if (c.loading) return <div className="gstate">Memuat...</div>;

  return (
    <div className="gpage">
      {/* header + tombol hamburger */}
      <div className="gpage-header">
        <button className="ghamburger" onClick={toggleSidebar}>☰</button>
        <h1>Mulai Mengajar</h1>
      </div>

      {/* card info jadwal yang sedang diajar */}
      <div className="gcard">
        <h2>Informasi Jadwal</h2>
        <div><b>Mapel:</b> {c.jadwal.nama_mapel}</div>
        <div><b>Kelas:</b> {c.jadwal.tingkat}{c.jadwal.nama_kelas}</div>
        <div><b>Sekolah:</b> {c.jadwal.nama_sekolah}</div>
      </div>

      {/* card absensi siswa: tabel + dropdown status per siswa */}
      <div className="gcard">
        <h2>Absensi Siswa</h2>
        <table className="gtable">
          <thead>
            <tr>
              <th>Nama</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {c.siswa.map((s) => (
              <tr key={s.id_siswa}>
                <td>{s.nama_lengkap}</td>
                <td>
                  <select
                    value={c.absensi[s.id_siswa] || "Hadir"}
                    onChange={(e) => c.setStatus(s.id_siswa, e.target.value)}
                  >
                    {c.STATUS_ABSENSI.map((st) => (
                      <option key={st.value} value={st.value}>
                        {st.label}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {c.error && <div className="galert">{c.error}</div>}

      {/* card jurnal mengajar */}
      <div className="gcard">
        <h2>Jurnal Mengajar</h2>

        {/* input materi */}
        <textarea
          placeholder="Materi diajarkan"
          value={c.jurnal.materi_diajarkan}
          onChange={(e) =>
            c.setJurnal((p) => ({ ...p, materi_diajarkan: e.target.value }))
          }
        />

        {/* input catatan kegiatan */}
        <textarea
          placeholder="Catatan kegiatan"
          value={c.jurnal.catatan_kegiatan}
          onChange={(e) =>
            c.setJurnal((p) => ({ ...p, catatan_kegiatan: e.target.value }))
          }
        />
      </div>

      {/* card catatan siswa: bisa tambah banyak baris */}
      <div className="gcard">
        <h2>Catatan Siswa</h2>

        {/* daftar catatan yang sudah ditambahkan */}
        {c.catatanList.map((ct, i) => (
          <div className="gcatatan" key={i}>
            <select onChange={(e) => c.updateCatatan(i, "id_siswa", e.target.value)}>
              <option value="">Pilih siswa</option>
              {c.siswa.map((s) => (
                <option key={s.id_siswa} value={s.id_siswa}>
                  {s.nama_lengkap}
                </option>
              ))}
            </select>

            {/* pilih jenis catatan */}
            <select
              value={ct.jenis_catatan}
              onChange={(e) => c.updateCatatan(i, "jenis_catatan", e.target.value)}
            >
              <option>Prestasi</option>
              <option>Pelanggaran</option>
              <option>Lainnya</option>
            </select>

            {/* input deskripsi */}
            <input
              placeholder="Deskripsi"
              value={ct.deskripsi}
              onChange={(e) => c.updateCatatan(i, "deskripsi", e.target.value)}
            />

            {/* hapus baris catatan */}
            <button onClick={() => c.removeCatatan(i)}>✕</button>
          </div>
        ))}

        {/* tambah catatan baru */}
        <button className="gbtn" onClick={c.addCatatan}>+ Tambah Catatan</button>
      </div>

      {/* tombol simpan semua data */}
      <button className="gprimary big" onClick={c.handleSubmit}>
        Simpan & Selesai
      </button>
    </div>
  );
}
