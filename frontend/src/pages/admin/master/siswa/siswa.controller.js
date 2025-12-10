import { useEffect, useMemo, useState } from "react";
import { masterApi } from "../../../../api/masterApi";
import { emptyForm } from "./siswa.model";

export function useSiswaController() {
  //state data dropdown sekolah dan kelas
  const [sekolah, setSekolah] = useState([]);
  const [kelas, setKelas] = useState([]);
  
  //state filter sekolah dan kelas
  const [filterSekolah, setFilterSekolah] = useState("");
  const [filterKelas, setFilterKelas] = useState("");

  //state data tabel siswa
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  //state error alert
  const [error, setError] = useState("");

  //state modal form tambah/edit
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  //label kelas aktif berdasarkan filterKelas
  const labelKelasAktif = useMemo(() => {
    if (!filterKelas) return "-";
    const k = kelas.find((x) => String(x.id_kelas) === String(filterKelas));
    return k ? `${k.tingkat} ${k.nama_kelas}` : "-";
  }, [kelas, filterKelas]);

  //mengambil data sekolah dari API
  const fetchSekolah = async () => {
    const res = await masterApi.getSekolah();
    setSekolah(res.data || []);
  };

  //mengambil data kelas berdasarkan sekolah dari API
  const fetchKelasForSekolah = async (id_sekolah) => {
    if (!id_sekolah) {
      setKelas([]);
      return;
    }
    const res = await masterApi.getKelasBySekolah(id_sekolah);
    setKelas(res.data || []);
  };

  //mengambil data siswa berdasarkan kelas dari API
  const fetchSiswa = async (id_kelas) => {
    if (!id_kelas) {
      const res = await masterApi.getSiswa(); 
      setRows(res.data || []);
      return;
    }
    const res = await masterApi.getSiswaByKelas(id_kelas); 
    setRows(res.data || []);
  };

  //load data awal sekolah dan siswa saat halaman dibuka
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        await fetchSekolah();
        await fetchSiswa(""); 
      } catch (e) {
        console.log("SISWA init error:", e.response?.status, e.response?.data);
        setError(e.response?.data?.message || "Gagal memuat data awal");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  //mengambil data kelas saat filterSekolah berubah
  useEffect(() => {
    (async () => {
      try {
        setError("");
        setFilterKelas(""); 

        if (!filterSekolah) {
          setKelas([]);
          return;
        }

        setLoading(true);
        await fetchKelasForSekolah(filterSekolah);
      } catch (e) {
        console.log("KELAS error:", e.response?.status, e.response?.data);
        setError(e.response?.data?.message || "Gagal mengambil data kelas");
      } finally {
        setLoading(false);
      }
    })();
  }, [filterSekolah]);

  //mengambil data siswa saat filterKelas berubah
  useEffect(() => {
    (async () => {
      try {
        setError("");
        setLoading(true);
        await fetchSiswa(filterKelas);
      } catch (e) {
        console.log("SISWA fetch error:", e.response?.status, e.response?.data);
        setError(e.response?.data?.message || "Gagal mengambil data siswa");
      } finally {
        setLoading(false);
      }
    })();
  }, [filterKelas]);

  //membuka modal form tambah siswa
  const openCreate = () => {
    if (!filterKelas) {
      return;
    }
    setMode("create");
    setSelected(null);
    setForm(emptyForm);
    setOpenForm(true);
    setError("");
  };

  //membuka modal form edit siswa
  const openEdit = (row) => {
    if (!filterKelas) {
      return;
    }
    setMode("edit");
    setSelected(row);
    setForm({
      nis: String(row.nis ?? ""),
      nama_lengkap: row.nama_lengkap ?? "",
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

  //submit form tambah/edit siswa
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
        //pastikan ada filterKelas yang dipilih
      if (!filterKelas) {
        return;
      }

      const payload = {
        id_kelas: Number(filterKelas),
        nis: String(form.nis).trim(),
        nama_lengkap: String(form.nama_lengkap).trim(),
      };

      if (mode === "create") {
        await masterApi.createSiswa(payload);
      } else {
        await masterApi.updateSiswa(selected.id_siswa, payload);
      }

      await fetchSiswa(filterKelas);
      closeForm();
    } catch (e2) {
      setError(e2.response?.data?.message || "Gagal menyimpan siswa");
    } finally {
      setSaving(false);
    }
  };

  //menghapus data siswa
  const handleDelete = async (row) => {
    const ok = confirm(`Hapus siswa: ${row.nama_lengkap} (NIS: ${row.nis})?`);
    if (!ok) return;

    try {
      setError("");
      await masterApi.deleteSiswa(row.id_siswa);
      await fetchSiswa(filterKelas); 
    } catch (e) {
      setError(e.response?.data?.message || "Gagal menghapus siswa");
    }
  };

  return {
    sekolah,
    kelas,

    filterSekolah,
    setFilterSekolah,
    filterKelas,
    setFilterKelas,

    rows,
    loading,
    error,

    openForm,
    mode,
    selected,
    form,
    saving,

    labelKelasAktif,

    openCreate,
    openEdit,
    closeForm,
    onChange,
    handleSubmit,
    handleDelete,
  };
}
