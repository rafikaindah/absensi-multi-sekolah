import { useEffect, useMemo, useState } from "react";
import { masterApi } from "../../../../api/masterApi";
import { emptyForm } from "./pendaftaranguru.model";

export function usePendaftaranGuruController() {

  // state data tabel pendaftaran guru  
  const [rows, setRows] = useState([]);
  const [pengguna, setPengguna] = useState([]);
  const [sekolah, setSekolah] = useState([]);
  const [loading, setLoading] = useState(true);

  // state search
  const [q, setQ] = useState("");

  // state error alert API
  const [error, setError] = useState("");

  // state modal form tambah/edit
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  // filter search (nama_lengkap, email, nama_sekolah)
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;

    return rows.filter((r) =>
      [r.nama_lengkap, r.email, r.nama_sekolah].some((v) =>
        String(v || "").toLowerCase().includes(needle)
      )
    );
  }, [rows, q]);

  //mengambil data pendaftaran guru dari API (dropdown pengguna "guru" dan sekolah)
  const fetchData = async () => {
    const [pgRes, penggunaRes, sekolahRes] = await Promise.all([
      masterApi.getPendaftaranGuru(),
      masterApi.getPengguna(),
      masterApi.getSekolah(),
    ]);

    setRows(pgRes.data || []);

    //mengambil data dengan peran "guru"
    const allPengguna = penggunaRes.data || [];
    setPengguna(allPengguna.filter((p) => p.peran === "guru"));

    setSekolah(sekolahRes.data || []);
  };

  // load data saat halaman pertama kali dibuka
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        await fetchData();
      } catch (e) {
        console.log("PENDAFTARAN GURU init error:", e.response?.status, e.response?.data);
        setError(e.response?.data?.message || "Gagal mengambil data pendaftaran guru");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // membuka form tambah pendaftaran guru
  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setForm(emptyForm);
    setOpenForm(true);
    setError("");
  };

  // membuka form edit pendaftaran guru
  const openEdit = (row) => {
    setMode("edit");
    setSelected(row);
    setForm({
      id_pengguna: String(row.id_pengguna ?? ""),
      id_sekolah: String(row.id_sekolah ?? ""),
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

  // mengubah nilai pada form
  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  // submit form tambah/edit pendaftaran guru
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        id_pengguna: Number(form.id_pengguna),
        id_sekolah: Number(form.id_sekolah),
      };

      if (mode === "create") await masterApi.createPendaftaranGuru(payload);
      else await masterApi.updatePendaftaranGuru(selected.id_pendaftaran, payload);

      await fetchData();
      closeForm();
    } catch (e2) {
      console.log("PENDAFTARAN GURU save error:", e2.response?.status, e2.response?.data);
      setError(e2.response?.data?.message || "Gagal menyimpan pendaftaran guru");
    } finally {
      setSaving(false);
    }
  };

  //menghapus data pendaftaran guru
  const handleDelete = async (row) => {
    const ok = confirm(
      `Hapus pendaftaran guru: ${row.nama_lengkap} (${row.email}) - ${row.nama_sekolah}?`
    );
    if (!ok) return;

    try {
      setError("");
      await masterApi.deletePendaftaranGuru(row.id_pendaftaran);
      await fetchData();
    } catch (e) {
      console.log("PENDAFTARAN GURU delete error:", e.response?.status, e.response?.data);
      setError(e.response?.data?.message || "Gagal menghapus pendaftaran guru");
    }
  };

  return {
    rows,
    filtered,
    q,
    setQ,

    pengguna,
    sekolah,
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
