import "../Master.css";
import { useKelasController } from "./kelas.controller";

export default function KelasPage() {
  const c = useKelasController();

  return (
    <div className="page">
      {/* header judul + search + tombol tambah */}
      <div className="page-header">
        <div>
          <h1>Master Data Kelas</h1>
        </div>

        <div className="actions">
          {/* input search cari sekolah / tingkat / nama kelas */}
          <input
            className="search"
            placeholder="Cari sekolah / tingkat / nama kelas..."
            value={c.q}
            onChange={(e) => c.setQ(e.target.value)}
          />

          {/* tombol tambah kelas */}
          <button className="primary" onClick={c.openCreate}>
            + Tambah Kelas
          </button>
        </div>
      </div>

      {/* pesan error */}
      {c.error && <div className="alert">{c.error}</div>}

      {/* card tabel kelas */}
      <div className="card">
        {c.loading ? (
          <div className="state">Memuat data...</div>
        ) : c.filtered.length === 0 ? (
          <div className="state">Data kosong.</div>
        ) : (
          <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>Sekolah</th>
                <th style={{ width: 120 }}>Tingkat</th>
                <th>Nama Kelas</th>
                <th style={{ width: 180 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {/* map data hasil filter ke baris tabel */}
              {c.filtered.map((r) => (
                <tr key={r.id_kelas}>
                  <td>{r.nama_sekolah}</td>
                  <td>{r.tingkat}</td>
                  <td>{r.nama_kelas}</td>

                  {/* tombol aksi edit + hapus */}
                  <td className="row-actions">
                    <button className="btn" onClick={() => c.openEdit(r)}>
                      Edit
                    </button>
                    <button className="btn danger" onClick={() => c.handleDelete(r)}>
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        )}
      </div>

      {/* modal tambah/edit kelas */}
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
                <h2>{c.mode === "create" ? "Tambah Kelas" : "Edit Kelas"}</h2>
              </div>
              <button className="icon" onClick={c.closeForm} title="Tutup">
                ✕
              </button>
            </div>

            {/* form tambah/edit */}
            <form className="form" onSubmit={c.handleSubmit}>
              <div className="grid">
                <div className="field">
                  <label>Sekolah</label>
                  <select
                    value={c.form.id_sekolah}
                    onChange={(e) => c.onChange("id_sekolah", e.target.value)}
                    required
                  >
                    <option value="">Pilih sekolah...</option>
                    {c.sekolah.map((s) => (
                      <option key={s.id_sekolah} value={String(s.id_sekolah)}>
                        {s.nama_sekolah}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Tingkat</label>
                  <input
                    value={c.form.tingkat}
                    onChange={(e) => c.onChange("tingkat", e.target.value)}
                    placeholder="Contoh: 10/XI"
                    required
                  />
                </div>

                <div className="field">
                  <label>Nama Kelas</label>
                  <input
                    value={c.form.nama_kelas}
                    onChange={(e) => c.onChange("nama_kelas", e.target.value)}
                    placeholder="Contoh: IPA 1 / A / B"
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
