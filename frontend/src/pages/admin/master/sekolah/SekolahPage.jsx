import "../Master.css";
import { useSekolahController } from "./sekolah.controller";

export default function SekolahPage() {
  const c = useSekolahController();

  return (
    // halaman master data sekolah
    <div className="page">
      {/* header judul dan tombol tambah */}
      <div className="page-header">
        <div>
          <h1>Master Data Sekolah</h1>
        </div>

        <div className="actions">
          {/* tombol tambah sekolah */}
          <button className="primary" onClick={c.openCreate}>
            + Tambah Sekolah
          </button>
        </div>
      </div>

      {c.error && <div className="alert">{c.error}</div>}

      {/* card tabel sekolah */}
      <div className="card">
        {c.loading ? (
          <div className="state">Memuat data...</div>
        ) : c.rows.length === 0 ? (
          <div className="state">Data kosong.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nama Sekolah</th>
                <th>Alamat</th>
                <th>Telepon</th>
                <th style={{ width: 180 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {c.rows.map((r) => (
                <tr key={r.id_sekolah}>
                  <td>{r.nama_sekolah}</td>
                  <td>{r.alamat}</td>
                  <td>{r.telepon}</td>

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
                <h2>{c.mode === "create" ? "Tambah Sekolah" : "Edit Sekolah"}</h2>
              </div>
              <button className="icon" onClick={c.closeForm} title="Tutup">
                ✕
              </button>
            </div>

            {/* form tambah/edit */}
            <form className="form" onSubmit={c.handleSubmit}>
              <div className="grid">
                <div className="field">
                  <label>Nama Sekolah</label>
                  <input
                    value={c.form.nama_sekolah}
                    onChange={(e) => c.onChange("nama_sekolah", e.target.value)}
                    placeholder="Contoh: SMPN 1 Bandung"
                    required
                  />
                </div>

                <div className="field">
                  <label>Alamat</label>
                  <input
                    value={c.form.alamat}
                    onChange={(e) => c.onChange("alamat", e.target.value)}
                    placeholder="Jl. Contoh No. 123"
                    required
                  />
                </div>

                <div className="field">
                  <label>Telepon</label>
                  <input
                    value={c.form.telepon}
                    onChange={(e) => c.onChange("telepon", e.target.value)}
                    placeholder="08xxxxxxxxxx"
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
