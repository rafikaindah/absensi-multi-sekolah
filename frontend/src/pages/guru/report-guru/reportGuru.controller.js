import { useEffect, useMemo, useState } from "react";
import { guruApi } from "../../../api/guruApi";
import { defaultFilter } from "./reportGuru.model";

//format tanggal
const fmtDate = (v) => {
  if (!v) return "";
  const d = new Date(v);
  return d.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

//format jam
const fmtTime = (v) => {
  if (!v) return "";
  const d = new Date(v);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};

export function useReportGuruController() {
  //state filter
  const [filter, setFilter] = useState(defaultFilter());

  //state loading dan error
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //state absensi guru dan jurnal
  const [absensiGuru, setAbsensiGuru] = useState([]);
  const [jurnal, setJurnal] = useState([]);

  //state list (dropdown sekolah)
  const [sekolahList, setSekolahList] = useState([]);

  //update filter per tanggal
  const onChange = (key, value) => {
    setFilter((prev) => ({ ...prev, [key]: value }));
  };

  //mengambil data sekolah yang dipilih
  const fetchSekolahOptions = async () => {
    try {
      const res = await guruApi.getSemuaJadwal();
      const rows = res.data || [];

      const map = new Map();

      for (const r of rows) {
        if (!r.id_sekolah) continue;

        if (!map.has(String(r.id_sekolah))) {
          map.set(String(r.id_sekolah), {
            id_sekolah: String(r.id_sekolah),
            nama_sekolah: r.nama_sekolah || `Sekolah ${r.id_sekolah}`,
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

  //mengambil data report guru dari backend
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        start: filter.start,
        end: filter.end,
      };

      if (filter.id_sekolah) {
        params.id_sekolah = filter.id_sekolah;
      }

      const res = await guruApi.reportGuru(params);

      setAbsensiGuru(res.data?.absensiGuru || []);
      setJurnal(res.data?.jurnal || []);
    } catch (e) {
      setError(e.response?.data?.message || "Gagal memuat report guru");
    } finally {
      setLoading(false);
    }
  };

  //load pertama kali halaman dibuka
  useEffect(() => {
    fetchSekolahOptions();
    fetchData();
  }, []);

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

    return Array.from(map.entries()).map(([nama_sekolah, rows]) => ({
      nama_sekolah,
      rows,
    }));
  }, [absensiGuru]);


  const groupedJurnal = useMemo(() => {
    const map = new Map();

    for (const j of jurnal) {
      const key = j.nama_sekolah || "Sekolah";

      if (!map.has(key)) map.set(key, []);

      map.get(key).push({
        ...j,
        waktu_fmt: fmtDate(j.timestamp), 
      });
    }

    return Array.from(map.entries()).map(([nama_sekolah, rows]) => ({
      nama_sekolah,
      rows,
    }));
  }, [jurnal]);


  return {
    filter,
    onChange,
    loading,
    error,

    sekolahList,
    
    fetchData,

    groupedAbsensi,
    groupedJurnal,
  };
}
