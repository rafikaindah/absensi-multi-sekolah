import { useEffect, useMemo, useState } from "react";
import { guruApi } from "../../../api/guruApi";
import { defaultFilter } from "./reportSiswa.model";

// format tanggal
const fmtDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export function useReportSiswaController() {
  //state filter
  const [filter, setFilter] = useState(defaultFilter());
  const [loading, setLoading] = useState(true);

  //state error dan loading
  const [error, setError] = useState("");

  //state absensi siswa dan catatan
  const [absensi, setAbsensi] = useState([]);
  const [catatan, setCatatan] = useState([]);

  //state list (dropdown sekolah dan kelas)
  const [sekolahList, setSekolahList] = useState([]);
  const [kelasList, setKelasList] = useState([]);

  //update filter
  const onChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  // dropdown sekolah dari jadwal guru
  const fetchSekolahOptions = async () => {
    try {
      const res = await guruApi.getSemuaJadwal();
      const rows = res.data || [];

      const map = new Map();

      for (const r of rows) {
        if (!r.id_sekolah) continue;

        const id = String(r.id_sekolah);
        if (!map.has(id)) {
          map.set(id, {
            id_sekolah: id,
            nama_sekolah: r.nama_sekolah || `Sekolah ${id}`,
          });
        }
      }

      const list = Array.from(map.values()).sort((a, b) =>
        a.nama_sekolah.localeCompare(b.nama_sekolah)
      );

      setSekolahList(list);
    } catch (e) {
      setSekolahList([]);
    }
  };

  // dropdown kelas dari sekolah yang dipilih
  const fetchKelasOptions = async (id_sekolah) => {
    try {
      if (!id_sekolah) {
        setKelasList([]);
        return;
      }

      const res = await guruApi.getKelasBySekolah(id_sekolah);
      const rows = res.data || [];

      const list = rows.map((k) => ({
        id_kelas: String(k.id_kelas),
        nama_kelas: k.nama_kelas,
        tingkat: k.tingkat,
      }));

      setKelasList(list);
    } catch (e) {
      setKelasList([]);
    }
  };

  // ambil data report siswa dari backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const params = { start: filter.start, end: filter.end };
      if (filter.id_sekolah) params.id_sekolah = filter.id_sekolah;
      if (filter.id_kelas) params.id_kelas = filter.id_kelas;

      const res = await guruApi.reportSiswa(params);

      setAbsensi(res.data?.absensi || []);
      setCatatan(res.data?.catatan || []);
    } catch (e) {
      setError(e.response?.data?.message || "Gagal memuat report siswa");
    } finally {
      setLoading(false);
    }
  };

  // load pertama kali halaman dibuka
  useEffect(() => {
    fetchSekolahOptions();
    fetchData();
  }, []);

  // jika sekolah berubah: reset kelas + fetch kelas
  useEffect(() => {
    setFilter((prev) => ({ ...prev, id_kelas: "" }));
    fetchKelasOptions(filter.id_sekolah);
  }, [filter.id_sekolah]);

  // ringkasan status absensi
  const stats = useMemo(() => {
    const count = { Sakit: 0, Izin: 0, Alpa: 0 };
    for (const a of absensi) {
      count[a.status] = (count[a.status] || 0) + 1;
    }
    return count;
  }, [absensi]);

  // helper label kelas: "tingkat-nama kelas"
  const kelasLabel = (row) => {
    const t = row.tingkat ? `${row.tingkat}-` : "";
    const nk = row.nama_kelas || "-";
    return `${t}${nk}`;
  };

  // grup per sekolah dan kelas
  const groupedAbsensi = useMemo(() => {
    const sekolahMap = new Map();

    for (const a of absensi) {
      const sekolahKey = a.nama_sekolah || "Sekolah";
      const kelasKey = kelasLabel(a);

      if (!sekolahMap.has(sekolahKey)) sekolahMap.set(sekolahKey, new Map());
      const kelasMap = sekolahMap.get(sekolahKey);

      if (!kelasMap.has(kelasKey)) kelasMap.set(kelasKey, []);
      kelasMap.get(kelasKey).push({
        ...a,
        tanggal_fmt: fmtDate(a.tanggal),
      });
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
      kelasMap.get(kelasKey).push({
        ...c,
        waktu_fmt: fmtDate(c.timestamp), 
      });
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

    sekolahList,
    kelasList,

    fetchData,
    stats,

    groupedAbsensi,
    groupedCatatan,
  };
}
