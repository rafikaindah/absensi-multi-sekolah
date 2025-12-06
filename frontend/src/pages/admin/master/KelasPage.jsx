import { useEffect, useMemo, useState } from "react";
import { masterApi } from "../../../api/masterApi";
import "./Master.css";

//// template kosong untuk form tambah/edit kelas
const emptyForm = {
  id_sekolah: "",
  tingkat: "",
  nama_kelas: "",
};

export default function KelasPage() {
  // state data tabel kelas
  const [rows, setRows] = useState([]);
  const [sekolah, setSekolah] = useState([]);
  const [loading, setLoading] = useState(true);

  // state search
  const [q, setQ] = useState("");
  // state error alert
  const [error, setError] = useState("");

  // state modal form tambah/edit
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // mengambil data kelas dari API
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // ambil sekolah (buat dropdown di modal)
      const sekolahRes = await masterApi.getSekolah();
      setSekolah(sekolahRes.data || []);

      // ambil semua kelas untuk ditampilkan di tabel
      const kelasRes = await masterApi.getKelas();
      setRows(kelasRes.data || []);
    } catch (e) {
      console.log("KELAS fetch error:", e.response?.status, e.response?.data);
      setError(e.response?.data?.message || "Gagal memuat data kelas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // filter tabel berdasarkan pencarian sekolah/tingkat/nama kelas
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;

    return rows.filter((r) =>
      [r.nama_sekolah, r.tingkat, r.nama_kelas].some((v) =>
        String(v || "").toLowerCase().includes(needle)
      )
    );
  }, [rows, q]);

  // membuka modal form tambah kelas
  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setForm(emptyForm);
    setOpenForm(true);
    setError("");
  };

  // membuka modal form edit kelas
  const openEdit = (row) => {
    setMode("edit");
    setSelected(row);
    setForm({
      id_sekolah: String(row.id_sekolah ?? ""),
      tingkat: String(row.tingkat ?? ""),
      nama_kelas: row.nama_kelas ?? "",
    });
    setOpenForm(true);
    setError("");
  };

  // menutup modal form tambah/edit
  const closeForm = () => {
    setOpenForm(false);
    setSaving(false);
    setForm(emptyForm);
    setSelected(null);
  };

  // mengubah nilai di form
  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  // submit form tambah/edit kelas
  const handleSubmit = async (e) => {
  e.preventDefault();
  setSaving(true);
  setError("");

  try {
    const payload = {
      id_sekolah: Number(form.id_sekolah),
      tingkat: String(form.tingkat).trim(),
      nama_kelas: String(form.nama_kelas).trim(),
    };

    if (mode === "create") await masterApi.createKelas(payload);
    else await masterApi.updateKelas(selected.id_kelas, payload);

    await fetchData();
    closeForm();
  } catch (e2) {
    setError(e2.response?.data?.message || "Gagal menyimpan kelas");
  } finally {
    setSaving(false);
  }
};

  // menghapus data kelas
  const handleDelete = async (row) => {
    const ok = confirm(
      `Hapus kelas: ${row.tingkat} ${row.nama_kelas} (${row.nama_sekolah || "-"})?`
    );
    if (!ok) return;

    try {
      setError("");
      await masterApi.deleteKelas(row.id_kelas);
      await fetchData();
    } catch (e) {
      setError(e.response?.data?.message || "Gagal menghapus kelas");
    }
  };

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
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

            {/* tombol tambah kelas */}
          <button className="primary" onClick={openCreate}>
            + Tambah Kelas
          </button>
        </div>
      </div>

        {/* pesan error */}
      {error && <div className="alert">{error}</div>}

        {/* card tabel kelas */}
      <div className="card">
        {loading ? (
          <div className="state">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="state">Data kosong.</div>
        ) : (
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
              {filtered.map((r) => (
                <tr key={r.id_kelas}>
                  <td>{r.nama_sekolah}</td>
                  <td>{r.tingkat}</td>
                  <td>{r.nama_kelas}</td>

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

        {/* modal tambah/edit kelas */}
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
                <h2>{mode === "create" ? "Tambah Kelas" : "Edit Kelas"}</h2>
              </div>
              <button className="icon" onClick={closeForm} title="Tutup">
                ✕
              </button>
            </div>

            {/* form tambah/edit */}
            <form className="form" onSubmit={handleSubmit}>
              <div className="grid">
                <div className="field">
                  <label>Sekolah</label>
                  <select
                    value={form.id_sekolah}
                    onChange={(e) => onChange("id_sekolah", e.target.value)}
                    required
                  >
                    <option value="">Pilih sekolah...</option>
                    {sekolah.map((s) => (
                      <option key={s.id_sekolah} value={String(s.id_sekolah)}>
                        {s.nama_sekolah}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Tingkat</label>
                  <input
                    value={form.tingkat}
                    onChange={(e) => onChange("tingkat", e.target.value)}
                    placeholder="Contoh: 10/XI"
                    required
                  />
                </div>

                <div className="field">
                  <label>Nama Kelas</label>
                  <input
                    value={form.nama_kelas}
                    onChange={(e) => onChange("nama_kelas", e.target.value)}
                    placeholder="Contoh: IPA 1 / A / B"
                    required
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
