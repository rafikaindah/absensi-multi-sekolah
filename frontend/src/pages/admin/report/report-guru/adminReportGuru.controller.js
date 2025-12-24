import { useEffect, useMemo, useState } from "react";
import { adminReportApi } from "../../../../api/adminReportApi";
import { masterApi } from "../../../../api/masterApi";
import { guruApi } from "../../../../api/guruApi";
import { defaultFilter } from "./adminReportGuru.model";

//format tanggal
const fmtDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return d.toLocaleDateString("id-ID", { 
    day: "2-digit", 
    month: "2-digit", 
    year: "numeric" });
};

//format jam
const fmtTime = (v) => {
  if (!v) return "";
  const d = new Date(v);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export function useAdminReportGuruController() {
  //state filter
  const [filter, setFilter] = useState(defaultFilter());

  //state loading dan error
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  //state absensi guru dan jurnal
  const [absensiGuru, setAbsensiGuru] = useState([]);
  const [jurnal, setJurnal] = useState([]);

  //state list dropdown sekolah dan guru
  const [sekolahList, setSekolahList] = useState([]);
  const [guruList, setGuruList] = useState([]);

  //update filter per tanggal
  const onChange = (key, value) => setFilter((p) => ({ ...p, [key]: value }));

  //mengambil data sekolah berdasarkan guru
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

  //mengambil data list guru (dropdown guru)
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

  //mengambil data report guru (admin) dari backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      if (!filter.id_pengguna) {
        setAbsensiGuru([]);
        setJurnal([]);
        setError("Pilih guru terlebih dahulu.");
        return;
      }

      const params = { start: filter.start, end: filter.end };
      params.id_pengguna = filter.id_pengguna;
      if (filter.id_sekolah) params.id_sekolah = filter.id_sekolah;

      const res = await adminReportApi.reportGuru(params);
      setAbsensiGuru(res.data?.absensiGuru || []);
      setJurnal(res.data?.jurnal || []);
    } catch (e) {
      setError(e.response?.data?.message || "Gagal memuat report guru (admin)");
    } finally {
      setLoading(false);
    }
  };

  //load pertama kali (mengambil list guru)
  useEffect(() => {
    fetchGuru();
  }, []);

  useEffect(() => {
    setFilter((p) => ({ ...p, id_sekolah: "" }));
    fetchSekolahByGuru(filter.id_pengguna);
  }, [filter.id_pengguna]);

  //grup per sekolah
  const groupedAbsensi = useMemo(() => {
    const map = new Map();
    for (const x of absensiGuru) {
      const key = x.nama_sekolah || "Sekolah";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({
        ...x,
        tanggal_fmt: fmtDate(x.tanggal),
        masuk_fmt: fmtTime(x.waktu_masuk),
        pulang_fmt: x.waktu_pulang ? fmtTime(x.waktu_pulang) : "—",
      });
    }
    return Array.from(map.entries()).map(([nama_sekolah, rows]) => ({ nama_sekolah, rows }));
  }, [absensiGuru]);

  const groupedJurnal = useMemo(() => {
    const map = new Map();
    for (const j of jurnal) {
      const key = j.nama_sekolah || "Sekolah";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push({ ...j, waktu_fmt: fmtDate(j.timestamp) });
    }
    return Array.from(map.entries()).map(([nama_sekolah, rows]) => ({ nama_sekolah, rows }));
  }, [jurnal]);

  return {
    filter,
    onChange,
    loading,
    error,
    sekolahList,
    guruList,
    fetchData,
    groupedAbsensi,
    groupedJurnal,
  };
}
