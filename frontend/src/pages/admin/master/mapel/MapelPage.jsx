import "../Master.css";
import { useMapelController } from "./mapel.controller";
import { useOutletContext } from "react-router-dom";

export default function MapelPage() {
  const c = useMapelController();
  const { toggleSidebar } = useOutletContext();

  return (
    // halaman master data mata pelajaran
    <div className="page">
      {/* header judul dan tombol tambah */}
      <div className="page-header">
        <div>
          <div className="title-row">
            {/* tombol hamburger */}
            <button
              className="hamburger"
              onClick={toggleSidebar}
              aria-label="Buka / tutup menu"
            >
              ☰
            </button>
            <h1>Master Data Mata Pelajaran</h1>
          </div>
        </div>

          {/* tombol tambah mata pelajaran */}
          <button className="primary" onClick={c.openCreate}>
            + Tambah Mata Pelajaran
          </button>
        </div>

      {/* pesan error dari API */}
      {c.error && <div className="alert">{c.error}</div>}

      {/* card tabel mata pelajaran */}
      <div className="card">
        {c.loading ? (
          <div className="state">Memuat data...</div>
        ) : c.rows.length === 0 ? (
          <div className="state">Data kosong.</div>
        ) : (
          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Nama Mata Pelajaran</th>
                  <th style={{ width: 180 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {c.rows.map((r) => (
                  <tr key={r.id_mapel}>
                    <td>{r.nama_mapel}</td>

                    {/* tombol aksi edit + hapus */}
                    <td className="row-actions">
                      <button className="btn" onClick={() => c.openEdit(r)}>
                        Edit
                      </button>
                      <button
                        className="btn danger"
                        onClick={() => c.handleDelete(r)}
                      >
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

      {/* modal tambah/edit mata pelajaran */}
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
                <h2>
                  {c.mode === "create"
                    ? "Tambah Mata Pelajaran"
                    : "Edit Mata Pelajaran"}
                </h2>
              </div>
              <button className="icon" onClick={c.closeForm} title="Tutup">
                ✕
              </button>
            </div>

            {/* form tambah/edit */}
            <form className="form" onSubmit={c.handleSubmit}>
              <div className="grid">
                <div className="field">
                  <label>Nama Mata Pelajaran</label>
                  <input
                    value={c.form.nama_mapel}
                    onChange={(e) => c.onChange("nama_mapel", e.target.value)}
                    placeholder="Contoh: Matematika"
                    required
                  />
                </div>
              </div>

              {/* tombol aksi modal */}
              <div className="modal-actions">
                <button
                  type="button"
                  className="btn"
                  onClick={c.closeForm}
                >
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
