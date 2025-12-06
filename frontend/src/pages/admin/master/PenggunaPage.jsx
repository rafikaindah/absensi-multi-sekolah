import { useEffect, useMemo, useState } from "react"; // import React hook
import { masterApi } from "../../../api/masterApi"; // import API master untuk CRUD pengguna
import "./Master.css"; // import file CSS

// template kosong untuk form tambah/edit pengguna
const emptyForm = {
  nama_lengkap: "",
  email: "",
  password: "",
  peran: "guru", 
};

export default function PenggunaPage() {
  const [rows, setRows] = useState([]); // data pengguna untuk ditampilkan di tabel
  const [loading, setLoading] = useState(true); // loading saat ambil data

  const [q, setQ] = useState(""); // state untuk pencarian/filter tabel
  const [error, setError] = useState(""); // pesan error API

  const [openForm, setOpenForm] = useState(false); // modal form tambah/edit
  const [mode, setMode] = useState("create"); // mode = create (tambah) / edit (ubah)
  const [selected, setSelected] = useState(null); // data pengguna yang sedang dipilih untuk edit
  const [form, setForm] = useState(emptyForm); // state form tambah/edit pengguna
  const [saving, setSaving] = useState(false); // loading saat simpan data

  // filter tabel berdasarkan pencarian nama/email/peran
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) =>
      [r.nama_lengkap, r.email, r.peran].some((v) =>
        String(v || "").toLowerCase().includes(needle)
      )
    );
  }, [rows, q]);

  // mengambil data pengguna dari API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await masterApi.getPengguna(); // API GET pengguna
      setRows(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Gagal mengambil data pengguna");
    } finally {
      setLoading(false);
    }
  };

  // load data saat halaman pertama kali dibuka
  useEffect(() => {
    fetchData();
  }, []);

  // membuka form tambah pengguna
  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setForm(emptyForm);
    setOpenForm(true);
    setError("");
  };

  // membuka form edit pengguna
  const openEdit = (row) => {
    setMode("edit");
    setSelected(row);
    setForm({
      nama_lengkap: row.nama_lengkap || "",
      email: row.email || "",
      password: "", // password dikosongkan saat edit
      peran: row.peran || "guru",
    });
    setOpenForm(true);
    setError("");
  };

  // menutup modal form
  const closeForm = () => {
    setOpenForm(false);
    setSaving(false);
    setForm(emptyForm);
    setSelected(null);
  };

  // mengubah value form
  const onChange = (key, value) => { // key: nama_lengkap, email, password, peran
    setForm((prev) => ({ ...prev, [key]: value })); // update field tertentu
  };

  // submit form tambah/edit pengguna
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      if (mode === "create") {
        // API untuk tambah pengguna (wajib kirim password)
        await masterApi.createPengguna({
          nama_lengkap: form.nama_lengkap,
          email: form.email,
          password: form.password,
          peran: form.peran,
        });
      } else {
        // Update data pengguna (password tidak ikut diubah)
        await masterApi.updatePengguna(selected.id_pengguna, {
          nama_lengkap: form.nama_lengkap,
          email: form.email,
          peran: form.peran,
        });
      }

      await fetchData(); 
      closeForm(); 
    } catch (e2) {
      setError(e2.response?.data?.message || "Gagal menyimpan pengguna");
    } finally {
      setSaving(false);
    }
  };

  // hapus pengguna
  const handleDelete = async (row) => {
    const ok = confirm(`Hapus pengguna: ${row.nama_lengkap} (${row.email})?`);
    if (!ok) return;

    try {
      setError("");
      await masterApi.deletePengguna(row.id_pengguna); 
      await fetchData(); 
    } catch (e) {
      setError(e.response?.data?.message || "Gagal menghapus pengguna");
    }
  };

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
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          {/* tombol tambah pengguna */}
          <button className="primary" onClick={openCreate}>
            + Tambah Pengguna
          </button>
        </div>
      </div>

      {/* pesan error */}
      {error && <div className="alert">{error}</div>}

      {/* card tabel pengguna */}
      <div className="card">
        {loading ? (
          <div className="state">Memuat data...</div> 
        ) : filtered.length === 0 ? (
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
              {filtered.map((r) => (
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
                    <button className="btn" onClick={() => openEdit(r)}>
                      Edit
                    </button>
                    <button className="btn danger" onClick={() => handleDelete(r)}>
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
      {openForm && (
        <div className="modal-backdrop" onMouseDown={closeForm}>
          <div
            className="modal"
            onMouseDown={(e) => e.stopPropagation()} 
            role="dialog"
            aria-modal="true"
          >

            {/* header modal */}
            <div className="modal-head">
              <div>
                <h2>{mode === "create" ? "Tambah Pengguna" : "Edit Pengguna"}</h2>
                <p>{mode === "create" ? "" : ""}</p>
              </div>
              <button className="icon" onClick={closeForm} title="Tutup">
                ✕
              </button>
            </div>

            {/* form tambah/edit */}
            <form className="form" onSubmit={handleSubmit}>
              <div className="grid">
                <div className="field">
                  <label>Nama Lengkap</label>
                  <input
                    value={form.nama_lengkap}
                    onChange={(e) => onChange("nama_lengkap", e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    required
                  />
                </div>

                <div className="field">
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    placeholder="contoh@email.com"
                    required
                  />
                </div>

                {/* password hanya muncul saat tambah, tidak muncul saat edit */}
                {mode === "create" && (
                  <div className="field">
                    <label>Password</label>
                    <input
                      type="password"
                      value={form.password}
                      onChange={(e) => onChange("password", e.target.value)}
                      placeholder="Minimal 8 karakter"
                      required
                      minLength={8}
                    />
                  </div>
                )}

                <div className="field">
                  <label>Peran</label>
                  <select
                    value={form.peran}
                    onChange={(e) => onChange("peran", e.target.value)}
                  >
                    <option value="admin">admin</option>
                    <option value="guru">guru</option>
                  </select>
                </div>
              </div>

              {/* tombol aksi modal */}
              <div className="modal-actions">
                <button type="button" className="btn" onClick={closeForm}>
                  Batal
                </button>
                <button type="submit" className="primary" disabled={saving}>
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </div>
  );
}
