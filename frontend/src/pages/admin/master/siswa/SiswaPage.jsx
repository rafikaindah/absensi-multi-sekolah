import "../Master.css";
import { useSiswaController } from "./siswa.controller";

export default function SiswaPage() {
  const c = useSiswaController();

  return (
    // halaman master data siswa
    <div className="page siswa-page">
      {/* header judul + filter sekolah/kelas + tombol tambah */}
      <div className="page-header">
        <div>
          <h1>Master Data Siswa</h1>
        </div>

        <div className="actions">
          {/* dropdown filter sekolah */}
          <select
            className="select"
            value={c.filterSekolah}
            onChange={(e) => c.setFilterSekolah(e.target.value)}
          >
            <option value="">Semua Sekolah</option>
            {c.sekolah.map((s) => (
              <option key={s.id_sekolah} value={String(s.id_sekolah)}>
                {s.nama_sekolah}
              </option>
            ))}
          </select>

          {/* dropdown filter kelas */}
          <select
            className="select"
            value={c.filterKelas}
            onChange={(e) => c.setFilterKelas(e.target.value)}
            disabled={!c.filterSekolah}
          >
            <option value="">Semua Kelas</option>
            {c.kelas.map((k) => (
              <option key={k.id_kelas} value={String(k.id_kelas)}>
                {k.tingkat} {k.nama_kelas}
              </option>
            ))}
          </select>

          {/* tombol tambah siswa */}
          <button className="primary" onClick={c.openCreate} disabled={!c.filterKelas}>
            + Tambah Siswa
          </button>
        </div>
      </div>

      {c.error && <div className="alert">{c.error}</div>}

      {/* card tabel siswa */}
      <div className="card">
        {c.loading ? (
          <div className="state">Memuat data...</div>
        ) : c.rows.length === 0 ? (
          <div className="state">Data kosong.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th style={{ width: 180 }}>NIS</th>
                <th>Nama Lengkap</th>
                <th style={{ width: 180 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.id_siswa}>
                  <td>{r.nis}</td>
                  <td>{r.nama_lengkap}</td>

                  {/* tombol aksi edit + hapus */}
                  <td className="row-actions">
                    <button className="btn" onClick={() => c.openEdit(r)} disabled={!c.filterKelas}>
                      Edit
                    </button>
                    <button
                      className="btn danger"
                      onClick={() => c.handleDelete(r)}
                      disabled={!c.filterKelas}
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* modal tambah/edit sekolah */}
      {c.openForm && (
        <div className="modal-backdrop" onMouseDown={c.closeForm}>
          <div
            className="modal"
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* header modal */}
            <div className="modal-head">
              <div>
                <h2>{c.mode === "create" ? "Tambah Siswa" : "Edit Siswa"}</h2>
                <p className="hint">Kelas aktif: {c.labelKelasAktif}</p>
              </div>
              <button className="icon" onClick={c.closeForm} title="Tutup">
                ✕
              </button>
            </div>

            {/* form tambah/edit */}
            <form className="form" onSubmit={c.handleSubmit}>
              <div className="grid">
                <div className="field">
                  <label>NIS</label>
                  <input
                    value={c.form.nis}
                    onChange={(e) => c.onChange("nis", e.target.value)}
                    placeholder="Contoh: 123456"
                    required
                  />
                </div>

                <div className="field">
                  <label>Nama Lengkap</label>
                  <input
                    value={c.form.nama_lengkap}
                    onChange={(e) => c.onChange("nama_lengkap", e.target.value)}
                    placeholder="Contoh: Santi Aulia"
                    required
                  />
                </div>
              </div>

              {/* tombol aksi modal */}
              <div className="modal-actions">
                <button type="button" className="btn" onClick={c.closeForm}>
                  Batal
                </button>
                <button type="submit" className="primary" disabled={c.saving}>
                  {c.saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
