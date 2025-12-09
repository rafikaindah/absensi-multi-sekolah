import { useEffect, useState } from "react";
import { masterApi } from "../../../../api/masterApi";
import { emptyForm } from "./sekolah.model";

export function useSekolahController() {
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

  return {
    rows,
    loading,
    error,

    openForm,
    mode,
    selected,
    form,
    saving,

    fetchData,
    openCreate,
    openEdit,
    closeForm,
    onChange,
    handleSubmit,
    handleDelete,
  };
}
