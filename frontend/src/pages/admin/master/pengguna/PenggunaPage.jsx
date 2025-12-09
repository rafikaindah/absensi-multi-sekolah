import "../Master.css";
import { usePenggunaController } from "./pengguna.controller";

export default function PenggunaPage() {
  const c = usePenggunaController();

  return (
    // wrapper halaman Pengguna
    <div className="page">
      {/* header halaman: judul + pencarian + tombol tambah */}
      <div className="page-header">
        <div>
          <h1>Master Data Pengguna</h1>
        </div>

        <div className="actions">
          {/* input pencarian */}
          <input
            className="search"
            placeholder="Cari nama / email / peran..."
            value={c.q}
            onChange={(e) => c.setQ(e.target.value)}
          />
          {/* tombol tambah pengguna */}
          <button className="primary" onClick={c.openCreate}>
            + Tambah Pengguna
          </button>
        </div>
      </div>

      {/* pesan error */}
      {c.error && <div className="alert">{c.error}</div>}

      {/* card tabel pengguna */}
      <div className="card">
        {c.loading ? (
          <div className="state">Memuat data...</div>
        ) : c.filtered.length === 0 ? (
          <div className="state">Data kosong.</div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nama Lengkap</th>
                <th>Email</th>
                <th>Peran</th>
                <th style={{ width: 180 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {c.filtered.map((r) => (
                <tr key={r.id_pengguna}>
                  <td>{r.nama_lengkap}</td>
                  <td>{r.email}</td>
                  <td>
                    <span className={`badge ${r.peran}`}>
                      {String(r.peran).toUpperCase()}
                    </span>
                  </td>

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

      {/* modal tambah/edit pengguna */}
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
                <h2>{c.mode === "create" ? "Tambah Pengguna" : "Edit Pengguna"}</h2>
              </div>
              <button className="icon" onClick={c.closeForm} title="Tutup">
                ✕
              </button>
            </div>

            {/* form tambah/edit */}
            <form className="form" onSubmit={c.handleSubmit}>
              <div className="grid">
                <div className="field">
                  <label>Nama Lengkap</label>
                  <input
                    value={c.form.nama_lengkap}
                    onChange={(e) => c.onChange("nama_lengkap", e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    required
                  />
                </div>

                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={c.form.email}
                    onChange={(e) => c.onChange("email", e.target.value)}
                    placeholder="contoh@email.com"
                    required
                  />
                </div>

                {/* password hanya muncul saat tambah, tidak muncul saat edit */}
                {c.mode === "create" && (
                  <div className="field">
                    <label>Password</label>
                    <input
                      type="password"
                      value={c.form.password}
                      onChange={(e) => c.onChange("password", e.target.value)}
                      placeholder="Minimal 8 karakter"
                      required
                      minLength={8}
                    />
                  </div>
                )}

                <div className="field">
                  <label>Peran</label>
                  <select
                    value={c.form.peran}
                    onChange={(e) => c.onChange("peran", e.target.value)}
                  >
                    <option value="admin">admin</option>
                    <option value="guru">guru</option>
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
