import { useEffect, useState } from "react";
import { masterApi } from "../../../api/masterApi"; 
import "./SekolahPage.css";

// template kosong untuk form tambah/edit sekolah
const emptyForm = {
  nama_sekolah: "",
  alamat: "",
  telepon: "",
};


export default function SekolahPage() {
  //state data tabel sekolah
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  //state error alert
  const [error, setError] = useState("");

  //state modal form tambah/edit
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create"); // create | edit
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  //mengambil data sekolah dari API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await masterApi.getSekolah();
      setRows(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || "Gagal mengambil data sekolah");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  //membuka modal form tambah sekolah
  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setForm(emptyForm);
    setOpenForm(true);
    setError("");
  };

  //membuka modal form edit sekolah
  const openEdit = (row) => {
    setMode("edit");
    setSelected(row);
    setForm({
      nama_sekolah: row.nama_sekolah || "",
      alamat: row.alamat || "",
      telepon: row.telepon || "",
    });
    setOpenForm(true);
    setError("");
  };

  //menutup modal form tambah/edit
  const closeForm = () => {
    setOpenForm(false);
    setSaving(false);
    setForm(emptyForm);
    setSelected(null);
  };

  //mengubah nilai pada form
  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  //submit form tambah/edit sekolah
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      //mode tambah post create sekolah
      if (mode === "create") {
        await masterApi.createSekolah({
          nama_sekolah: form.nama_sekolah,
          alamat: form.alamat,
          telepon: form.telepon,
        });
      } else {
        //mode edit put update sekolah
        await masterApi.updateSekolah(selected.id_sekolah, {
          nama_sekolah: form.nama_sekolah,
          alamat: form.alamat,
          telepon: form.telepon,
        });
      }

      await fetchData();
      closeForm();
    } catch (e2) {
      setError(e2.response?.data?.message || "Gagal menyimpan sekolah");
    } finally {
      setSaving(false);
    }
  };

  //menghapus data sekolah
  const handleDelete = async (row) => {
    const ok = confirm(`Hapus sekolah: ${row.nama_sekolah}?`);
    if (!ok) return;

    try {
      setError("");
      await masterApi.deleteSekolah(row.id_sekolah);
      await fetchData();
    } catch (e) {
      setError(e.response?.data?.message || "Gagal menghapus sekolah");
    }
  };

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
          <button className="primary" onClick={openCreate}>
            + Tambah Sekolah
          </button>
        </div>
      </div>

      {error && <div className="alert">{error}</div>}

      {/* card tabel sekolah */}
      <div className="card">
        {loading ? (
          <div className="state">Memuat data...</div>
        ) : rows.length === 0 ? (
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
              {rows.map((r) => (
                <tr key={r.id_sekolah}>
                  <td>{r.nama_sekolah}</td>
                  <td>{r.alamat}</td> 
                  <td>{r.telepon}</td>

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

      {/* modal tambah/edit sekolah */}
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
                <h2>{mode === "create" ? "Tambah Sekolah" : "Edit Sekolah"}</h2>
              </div>
              <button className="icon" onClick={closeForm} title="Tutup">
                ✕
              </button>
            </div>

            {/* form tambah/edit */}
            <form className="form" onSubmit={handleSubmit}>
              <div className="grid">
                <div className="field">
                  <label>Nama Sekolah</label>
                  <input
                    value={form.nama_sekolah}
                    onChange={(e) => onChange("nama_sekolah", e.target.value)}
                    placeholder="Contoh: SMPN 1 Bandung"
                    required
                  />
                </div>

                <div className="field">
                  <label>Alamat</label>
                  <input
                    value={form.alamat}
                    onChange={(e) => onChange("alamat", e.target.value)}
                    placeholder="Jl. Contoh No. 123"
                  />
                </div>

                <div className="field">
                  <label>Telepon</label>
                  <input
                    value={form.telepon}
                    onChange={(e) => onChange("telepon", e.target.value)}
                    placeholder="08xxxxxxxxxx"
                  />
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
