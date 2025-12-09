import { useEffect, useMemo, useState } from "react";
import { masterApi } from "../../../../api/masterApi";
import { emptyForm } from "./pengguna.model";

export function usePenggunaController() { 
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

  return {
    rows,
    setRows,
    loading,
    setLoading,

    q,
    setQ,
    error,
    setError,

    openForm,
    setOpenForm,
    mode,
    setMode,
    selected,
    setSelected,
    form,
    setForm,
    saving,
    setSaving,

    filtered,
    fetchData,
    openCreate,
    openEdit,
    closeForm,
    onChange,
    handleSubmit,
    handleDelete,
  };
}
