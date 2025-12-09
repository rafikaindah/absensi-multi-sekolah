import { useEffect, useMemo, useState } from "react";
import { masterApi } from "../../../../api/masterApi";
import { emptyForm } from "./kelas.model";

export function useKelasController() {
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

  return {
    rows,
    sekolah,
    loading,

    q,
    setQ,

    error,

    openForm,
    mode,
    selected,
    form,
    saving,

    fetchData,
    filtered,
    openCreate,
    openEdit,
    closeForm,
    onChange,
    handleSubmit,
    handleDelete,
  };
}
