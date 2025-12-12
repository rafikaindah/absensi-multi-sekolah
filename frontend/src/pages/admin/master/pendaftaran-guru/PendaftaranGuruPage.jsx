import "../Master.css";
import { useOutletContext } from "react-router-dom";
import { usePendaftaranGuruController } from "./pendaftaranguru.controller";

export default function PendaftaranGuruPage() {
  const c = usePendaftaranGuruController();
  const { toggleSidebar } = useOutletContext();

  return (
    // halaman master data pendaftaran guru
    <div className="page">
      {/* header judul + search + tombol tambah */}
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
            <h1>Master Data Pendaftaran Guru</h1>
          </div>
        </div>

        <div className="actions">
          {/* input search cari nama guru / email / sekolah */}
          <input
            className="search"
            placeholder="Cari nama guru / email / sekolah..."
            value={c.q}
            onChange={(e) => c.setQ(e.target.value)}
          />

          {/* tombol tambah pendaftaran guru */}
          <button className="primary" onClick={c.openCreate}>
            + Tambah Pendaftaran
          </button>
        </div>
      </div>

      {/* pesan error */}
      {c.error && <div className="alert">{c.error}</div>}

      {/* card tabel pendaftaran guru */}
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
                  <th>Nama Lengkap</th>
                  <th>Email</th>
                  <th>Sekolah</th>
                  <th style={{ width: 180 }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {/* map data hasil filter ke baris tabel */}
                {c.filtered.map((r) => (
                  <tr key={r.id_pendaftaran}>
                    <td>{r.nama_lengkap}</td>
                    <td>{r.email}</td>
                    <td>{r.nama_sekolah}</td>

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

      {/* modal tambah/edit pendaftaran guru */}
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
                <h2>{c.mode === "create" ? "Tambah Pendaftaran" : "Edit Pendaftaran"}</h2>
              </div>
              <button className="icon" onClick={c.closeForm} title="Tutup">
                ✕
              </button>
            </div>

            {/* form tambah/edit */}
            <form className="form" onSubmit={c.handleSubmit}>
              <div className="grid">
                <div className="field">
                  <label>Guru</label>
                  <select
                    value={c.form.id_pengguna}
                    onChange={(e) => c.onChange("id_pengguna", e.target.value)}
                    required
                  >
                    <option value="">Pilih guru...</option>
                    {c.pengguna.map((p) => (
                      <option key={p.id_pengguna} value={String(p.id_pengguna)}>
                        {p.nama_lengkap} ({p.email})
                      </option>
                    ))}
                  </select>
                </div>

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
