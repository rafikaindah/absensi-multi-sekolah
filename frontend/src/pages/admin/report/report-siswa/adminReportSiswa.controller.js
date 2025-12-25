import { useEffect, useMemo, useState } from "react";
import { adminReportApi } from "../../../../api/adminReportApi";
import { masterApi } from "../../../../api/masterApi";
import { guruApi } from "../../../../api/guruApi"; 
import { defaultFilter } from "./adminReportSiswa.model";

//format tanggal
const fmtDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return d.toLocaleDateString("id-ID", { 
    day: "2-digit", 
    month: "2-digit", 
    year: "numeric" 
  });
};

export function useAdminReportSiswaController() {
  //state filter
  const [filter, setFilter] = useState(defaultFilter());

  //state loading dan error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //state absensi siswa dan catatan
  const [absensi, setAbsensi] = useState([]);
  const [catatan, setCatatan] = useState([]);

  //state list (dropdown guru,sekolah,kelas)
  const [guruList, setGuruList] = useState([]);
  const [sekolahList, setSekolahList] = useState([]);
  const [kelasList, setKelasList] = useState([]);

  //update filter
  const onChange = (key, value) => setFilter((p) => ({ ...p, [key]: value }));

  //dropdown guru dari master pengguna
  const fetchGuru = async () => {
    try {
      const res = await masterApi.getPengguna();
      const rows = res.data || [];
      setGuruList(
        rows
          .filter((u) => u.peran === "guru")
          .map((u) => ({
            id_pengguna: String(u.id_pengguna),
            nama: u.nama_lengkap || u.nama || u.email || `Guru ${u.id_pengguna}`,
          }))
          .sort((a, b) => a.nama.localeCompare(b.nama))
      );
    } catch {
      setGuruList([]);
    }
  };

  //dropdown sekolah bedasarkan guru
  const fetchSekolahByGuru = async (id_pengguna) => {
    try {
      if (!id_pengguna) {
        setSekolahList([]);
        return;
      }
      const res = await guruApi.getSekolahByGuru(id_pengguna);
      setSekolahList(
        (res.data || []).map((s) => ({
          id_sekolah: String(s.id_sekolah),
          nama_sekolah: s.nama_sekolah,
        }))
      );
    } catch {
      setSekolahList([]);
    }
  };

  //dropdown kelas berdasarkan sekolah
  const fetchKelas = async (id_sekolah) => {
    try {
      if (!id_sekolah) {
        setKelasList([]);
        return;
      }
      const res = await masterApi.getKelasBySekolah(id_sekolah);
      setKelasList(
        (res.data || []).map((k) => ({
          id_kelas: String(k.id_kelas),
          nama_kelas: k.nama_kelas,
          tingkat: k.tingkat,
        }))
      );
    } catch {
      setKelasList([]);
    }
  };

  //load pertama kali (mengambil list guru)
  useEffect(() => {
    fetchGuru();
  }, []);

  //jika guru berubah: reset sekolah+kelas
  useEffect(() => {
    setFilter((p) => ({ ...p, id_sekolah: "", id_kelas: "" }));
    setKelasList([]);
    fetchSekolahByGuru(filter.id_pengguna);
  }, [filter.id_pengguna]);

  //jika sekolah berubah: reset kelas
  useEffect(() => {
    setFilter((p) => ({ ...p, id_kelas: "" }));
    fetchKelas(filter.id_sekolah);
  }, [filter.id_sekolah]);

   // ringkasan status absensi
  const stats = useMemo(() => {
    const count = { Sakit: 0, Izin: 0, Alpa: 0 };
    for (const a of absensi) {
      count[a.status] = (count[a.status] || 0) + 1;
    }
    return count;
  }, [absensi]);

  //helper label kelas: "tingkat-nama kelas"
  const kelasLabel = (row) => {
    const t = row.tingkat ? `${row.tingkat}-` : "";
    const nk = row.nama_kelas || "-";
    return `${t}${nk}`;
  };

  //mengambil data report siswa (admin) dari backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!filter.id_pengguna) {
        setAbsensi([]);
        setCatatan([]);
        setError("Pilih guru terlebih dahulu.");
        return;
      }

      const params = { start: filter.start, end: filter.end };
      params.id_pengguna = filter.id_pengguna;
      if (filter.id_sekolah) params.id_sekolah = filter.id_sekolah;
      if (filter.id_kelas) params.id_kelas = filter.id_kelas;

      const res = await adminReportApi.reportSiswa(params);
      setAbsensi(res.data?.absensi || []);
      setCatatan(res.data?.catatan || []);
    } catch (e) {
      setError(e.response?.data?.message || "Gagal memuat report siswa (admin)");
    } finally {
      setLoading(false);
    }
  };

  //grup per sekolah dan kelas
  const groupedAbsensi = useMemo(() => {
    const sekolahMap = new Map();
    for (const a of absensi) {
      const sekolahKey = a.nama_sekolah || "Sekolah";
      const kelasKey = kelasLabel(a);

      if (!sekolahMap.has(sekolahKey)) sekolahMap.set(sekolahKey, new Map());
      const kelasMap = sekolahMap.get(sekolahKey);

      if (!kelasMap.has(kelasKey)) kelasMap.set(kelasKey, []);
      kelasMap.get(kelasKey).push({ ...a, tanggal_fmt: fmtDate(a.tanggal) });
    }

    return Array.from(sekolahMap.entries()).map(([nama_sekolah, kelasMap]) => ({
      nama_sekolah,
      kelas: Array.from(kelasMap.entries()).map(([nama_kelas, rows]) => ({
        nama_kelas,
        rows,
      })),
    }));
  }, [absensi]);

  const groupedCatatan = useMemo(() => {
    const sekolahMap = new Map();
    for (const c of catatan) {
      const sekolahKey = c.nama_sekolah || "Sekolah";
      const kelasKey = kelasLabel(c);

      if (!sekolahMap.has(sekolahKey)) sekolahMap.set(sekolahKey, new Map());
      const kelasMap = sekolahMap.get(sekolahKey);

      if (!kelasMap.has(kelasKey)) kelasMap.set(kelasKey, []);
      kelasMap.get(kelasKey).push({ ...c, waktu_fmt: fmtDate(c.timestamp) });
    }

    return Array.from(sekolahMap.entries()).map(([nama_sekolah, kelasMap]) => ({
      nama_sekolah,
      kelas: Array.from(kelasMap.entries()).map(([nama_kelas, rows]) => ({
        nama_kelas,
        rows,
      })),
    }));
  }, [catatan]);

  return {
    filter,
    onChange,
    loading,
    error,
    guruList,
    sekolahList,
    kelasList,
    fetchData,
    stats,
    groupedAbsensi,
    groupedCatatan,
  };
}
