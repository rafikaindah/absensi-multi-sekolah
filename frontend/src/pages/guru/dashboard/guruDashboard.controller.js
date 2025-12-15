import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import { guruApi } from "../../../api/guruApi";
import { todayHariIndo } from "../../../utils/hariIndo";
import { emptyPresensiForm, storageKeys } from "./guruDashboard.model";

// mengambil tanggal hari ini format YYYY-MM-DD
const today = () => dayjs().format("YYYY-MM-DD");

// mengambil data JSON dari localStorage 
const loadJson = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
};

export function useGuruDashboardController() {
  // state loading & error 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // state form presensi (mode manual: input id_sekolah)
  const [presensiForm, setPresensiForm] = useState(emptyPresensiForm);

  // state semua jadwal dari API 
  const [jadwalAll, setJadwalAll] = useState([]);

  // mengambil hari dan tanggal hari ini 
  const hariIni = useMemo(() => todayHariIndo(), []);
  const tanggalIni = useMemo(() => today(), []);

  // state sekolah aktif 
  const [activeSchool, setActiveSchool] = useState(
    () => localStorage.getItem(storageKeys.activeSchool) || ""
  );

  // state cache sesi presensi per sekolah 
  const [sesiBySchool, setSesiBySchool] = useState(
    () => loadJson(storageKeys.sesiBySchool, {})
  );

  // menyimpan sesi presensi per sekolah ke state + localStorage
  const persistSesi = (next) => {
    setSesiBySchool(next);
    localStorage.setItem(storageKeys.sesiBySchool, JSON.stringify(next));
  };

  // set sekolah aktif ke state + localStorage
  const setActive = (id_sekolah) => {
    setActiveSchool(id_sekolah);
    localStorage.setItem(storageKeys.activeSchool, id_sekolah);
  };

  // mengambil semua jadwal mengajar dari API
  const fetchJadwal = async () => {
    const res = await guruApi.getSemuaJadwal();
    setJadwalAll(res.data || []);
  };

  // load data saat halaman pertama kali dibuka
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");
        await fetchJadwal();
      } catch (e) {
        setError(e.response?.data?.message || "Gagal memuat dashboard guru");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // filter jadwal khusus untuk hari ini
  const jadwalHariIni = useMemo(() => {
    return jadwalAll.filter((j) => String(j.hari) === String(hariIni));
  }, [jadwalAll, hariIni]);

  // mengubah nilai input pada form presensi
  const onChangePresensi = (key, value) => {
    setPresensiForm((p) => ({ ...p, [key]: value }));
  };

  // proses check-in presensi guru berdasarkan id_sekolah (mode manual)
  const handleCheckin = async () => {
    setError("");
    const id_sekolah = String(presensiForm.id_sekolah || "").trim();
    if (!id_sekolah) return setError("id_sekolah wajib diisi (mode manual).");

    try {
      const res = await guruApi.checkin({ id_sekolah });

      // simpan status check-in per sekolah untuk hari ini
      const next = {
        ...sesiBySchool,
        [id_sekolah]: {
          id_sesi: res.data.id_sesi,
          tanggal: tanggalIni,
          waktu_masuk: "OK",
          waktu_pulang: null,
        },
      };

      persistSesi(next);
      setActive(id_sekolah);
    } catch (e) {
      setError(e.response?.data?.message || "Gagal check-in");
    }
  };

  // proses check-out presensi guru berdasarkan id_sekolah (mode manual)
  const handleCheckout = async () => {
    setError("");
    const id_sekolah = String(presensiForm.id_sekolah || "").trim();
    if (!id_sekolah) return setError("id_sekolah wajib diisi (mode manual).");

    try {
      await guruApi.checkout({ id_sekolah });

      // update status check-out per sekolah untuk hari ini
      const next = {
        ...sesiBySchool,
        [id_sekolah]: {
          ...(sesiBySchool[id_sekolah] || {}),
          tanggal: tanggalIni,
          waktu_pulang: "OK",
        },
      };

      persistSesi(next);
      setActive(id_sekolah);
    } catch (e) {
      setError(e.response?.data?.message || "Gagal check-out");
    }
  };

  // tombol "Mulai Mengajar" aktif atau tidak
  const canMulaiMengajar = (row) => {
    // ambil id sekolah dari row jadwal
    const id_sekolah = String(row.id_sekolah || row.id_sekolah_jadwal || "");

    //jika API jadwal belum kirim id_sekolah, tombol akan selalu nonaktif
    if (!id_sekolah) return false;

    // tombol aktif kalau sudah check-in di sekolah itu hari ini
    const sesi = sesiBySchool[id_sekolah];
    return sesi && sesi.tanggal === tanggalIni && sesi.waktu_masuk;
  };

  return {
    loading, error, setError,
    presensiForm, onChangePresensi,
    activeSchool, sesiBySchool,
    hariIni, tanggalIni,
    jadwalHariIni,
    handleCheckin,
    handleCheckout,
    canMulaiMengajar,
  };
}
