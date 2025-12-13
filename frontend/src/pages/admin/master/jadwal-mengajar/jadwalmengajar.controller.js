import { useEffect, useMemo, useState } from "react";
import { masterApi } from "../../../../api/masterApi";
import { emptyJadwalMengajarForm } from "./jadwalmengajar.model";

export function useJadwalMengajarController() {
  // state data tabel jadwal mengajar
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  // state search
  const [q, setQ] = useState("");

  // state dropdown untuk form
  const [pendaftaran, setPendaftaran] = useState([]);
  const [kelas, setKelas] = useState([]);
  const [mapel, setMapel] = useState([]);

  // state error alert API
  const [error, setError] = useState("");

  // state modal form tambah/edit
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState("create");
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(emptyJadwalMengajarForm);
  const [saving, setSaving] = useState(false);

  // filter berdasarkan search
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;

    return rows.filter((r) =>
      [
        r.nama_guru,
        r.nama_sekolah,
        r.tingkat,
        r.nama_kelas,
        r.nama_mapel,
        r.hari,
      ].some((v) => String(v || "").toLowerCase().includes(needle))
    );
  }, [rows, q]);

  //mengambil data jadwal mengajar untuk tabel
  const fetchData = async () => {
    const res = await masterApi.getJadwalMengajar();
    setRows(res.data || []);
  };

  //mengambil data dropdown untuk modal
  const fetchDropdowns = async () => {
  const [pgRes, mapelRes] = await Promise.all([
    masterApi.getPendaftaranGuru(),
    masterApi.getMapel(),
  ]);

  setPendaftaran(pgRes.data || []);
  setMapel(mapelRes.data || []);
  setKelas([]); 
  };

  // load data saat halaman pertama kali dibuka
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        await fetchDropdowns();
        await fetchData();
      } catch (e) {
        console.log("JADWAL init error:", e.response?.status, e.response?.data);
        setError(e.response?.data?.message || "Gagal mengambil data jadwal mengajar");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // update dropdown kelas berdasarkan sekolah dari pendaftaran guru yang dipilih
  useEffect(() => {
  (async () => {
    // jika belum pilih pendaftaran => kosongkan kelas
    if (!form.id_pendaftaran) {
      setKelas([]);
      return;
    }
    // cari data pendaftaran yang dipilih
    const pg = pendaftaran.find(
      (x) => String(x.id_pendaftaran) === String(form.id_pendaftaran)
    );
    const idSekolah = pg?.id_sekolah; 
    if (!idSekolah) {
      setKelas([]);
      return;
    }

    try {
      const res = await masterApi.getKelasBySekolah(idSekolah);
      setKelas(res.data || []);
    } catch (e) {
      setKelas([]);
      setError(e.response?.data?.message || "Gagal mengambil kelas berdasarkan sekolah");
    }
  })();
}, [form.id_pendaftaran, pendaftaran]);

  // membuka form tambah jadwal
  const openCreate = () => {
    setMode("create");
    setSelected(null);
    setForm(emptyJadwalMengajarForm);
    setOpenForm(true);
    setError("");
  };

  // membuka form edit jadwal
  const openEdit = (row) => {
    setMode("edit");
    setSelected(row);
    setForm({
      id_pendaftaran: String(row.id_pendaftaran ?? ""),
      id_kelas: String(row.id_kelas ?? ""),
      id_mapel: String(row.id_mapel ?? ""),
      hari: row.hari ?? "",
      jam_mulai: row.jam_mulai ?? "",
      jam_selesai: row.jam_selesai ?? "",
    });
    setOpenForm(true);
    setError("");
  };

  // menutup modal form
  const closeForm = () => {
    setOpenForm(false);
    setSaving(false);
    setForm(emptyJadwalMengajarForm);
    setSelected(null);
  };

  // mengubah nilai pada form
  const onChange = (key, value) => {
  setForm((p) => {
    if (key === "id_pendaftaran") {
      return { ...p, id_pendaftaran: value, id_kelas: "" }; // reset kelas
    }
    return { ...p, [key]: value };
  });
  };

  // submit form tambah/edit jadwal
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        id_pendaftaran: Number(form.id_pendaftaran),
        id_kelas: Number(form.id_kelas),
        id_mapel: Number(form.id_mapel),
        hari: String(form.hari).trim(),
        jam_mulai: String(form.jam_mulai).trim(),
        jam_selesai: String(form.jam_selesai).trim(),
      };

      if (mode === "create") {
        await masterApi.createJadwalMengajar(payload);
      } else {
        await masterApi.updateJadwalMengajar(selected.id_jadwal, payload);
      }

      await fetchData();
      closeForm();
    } catch (e2) {
      console.log("JADWAL save error:", e2.response?.status, e2.response?.data);
      setError(e2.response?.data?.message || "Gagal menyimpan jadwal mengajar");
    } finally {
      setSaving(false);
    }
  };

  //menghapus data jadwal
  const handleDelete = async (row) => {
    const ok = confirm(
      `Hapus jadwal: ${row.nama_guru} - ${row.nama_mapel} (${row.nama_sekolah} ${row.tingkat} ${row.nama_kelas})?`
    );
    if (!ok) return;

    try {
      setError("");
      await masterApi.deleteJadwalMengajar(row.id_jadwal);
      await fetchData();
    } catch (e) {
      console.log("JADWAL delete error:", e.response?.status, e.response?.data);
      setError(e.response?.data?.message || "Gagal menghapus jadwal mengajar");
    }
  };

    return {
    rows,
    filtered,
    loading,
    error,

    q,
    setQ,

    pendaftaran,
    kelas,
    mapel,

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
