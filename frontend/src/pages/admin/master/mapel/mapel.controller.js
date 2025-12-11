import { useEffect, useState } from "react";
import { masterApi } from "../../../../api/masterApi";
import { emptyMapelForm } from "./mapel.model";

export function useMapelController() {
  // state data tabel mapel
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // state error alert (khusus error dari API)
  const [error, setError] = useState("");

  // state modal form tambah/edit
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyMapelForm);
  const [saving, setSaving] = useState(false);

  // mengambil data mata pelajaran dari API
  const fetchData = async () => {
    const res = await masterApi.getMapel();
    setRows(res.data || []);
  };

  // load data awal saat halaman dibuka
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        await fetchData();
      } catch (e) {
        console.log("MAPEL init error:", e.response?.status, e.response?.data);
        setError(e.response?.data?.message || "Gagal mengambil data mata pelajaran");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // membuka modal form tambah mapel
  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setForm(emptyMapelForm);
    setOpenForm(true);
    setError("");
  };

  // membuka modal form edit mapel
  const openEdit = (row) => {
    setMode("edit");
    setSelected(row);
    setForm({
      nama_mapel: row.nama_mapel || "",
    });
    setOpenForm(true);
    setError("");
  };

  // menutup modal form
  const closeForm = () => {
    setOpenForm(false);
    setSaving(false);
    setForm(emptyMapelForm);
    setSelected(null);
  };

  // mengubah nilai pada form
  const onChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // submit form tambah/edit mata pelajaran
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        nama_mapel: String(form.nama_mapel).trim(),
      };

      if (!payload.nama_mapel) {
        setSaving(false);
        return;
      }

      if (mode === "create") {
        await masterApi.createMapel(payload);
      } else {
        await masterApi.updateMapel(selected.id_mapel, payload);
      }

      await fetchData();
      closeForm();
    } catch (e2) {
      console.log("MAPEL save error:", e2.response?.status, e2.response?.data);
      setError(e2.response?.data?.message || "Gagal menyimpan mata pelajaran");
    } finally {
      setSaving(false);
    }
  };

  // menghapus data mata pelajaran
  const handleDelete = async (row) => {
    const ok = confirm(`Hapus mata pelajaran: ${row.nama_mapel}?`);
    if (!ok) return;

    try {
      setError("");
      await masterApi.deleteMapel(row.id_mapel);
      await fetchData();
    } catch (e) {
      console.log("MAPEL delete error:", e.response?.status, e.response?.data);
      setError(e.response?.data?.message || "Gagal menghapus mata pelajaran");
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

    openCreate,
    openEdit,
    closeForm,
    onChange,
    handleSubmit,
    handleDelete,
  };
}
