import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { guruApi } from "../../../api/guruApi";
import { STATUS_ABSENSI, emptyJurnal, emptyCatatan } from "./mulaiMengajar.model";

  // key storage untuk menyimpan status "jadwal sudah selesai hari ini"
  const storageSelesaiByJadwal = "guru_selesai_by_jadwal";

  // helper untuk mengambil data JSON dari localStorage.
  const loadJson = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  };

  // tanda "selesai hari ini" untuk id_jadwal tertentu
  const markJadwalSelesaiHariIni = (id_jadwal) => {
    const tanggal = dayjs().format("YYYY-MM-DD");
    const prev = loadJson(storageSelesaiByJadwal, {});
    const next = {
      ...prev,
      [String(id_jadwal)]: { tanggal, selesai: true },
    };
    localStorage.setItem(storageSelesaiByJadwal, JSON.stringify(next));
  };

  // mengecek apakah id_jadwal sudah ditandai selesai untuk tanggal hari ini
  const isJadwalSelesaiHariIni = (id_jadwal) => {
    const tanggal = dayjs().format("YYYY-MM-DD");
    const map = loadJson(storageSelesaiByJadwal, {});
    const rec = map[String(id_jadwal)];
    return !!(rec && rec.selesai && rec.tanggal === tanggal);
  };

export function useMulaiMengajarController() {
  const { id_jadwal } = useParams();
  const navigate = useNavigate();

  // state loading & error 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // data jadwal yang sedang dipilih + daftar siswa 
  const [jadwal, setJadwal] = useState(null);
  const [siswa, setSiswa] = useState([]);

  // absensi disimpan per siswa
  const [absensi, setAbsensi] = useState({});

  // jurnal mengajar
  const [jurnal, setJurnal] = useState(emptyJurnal);

  // daftar catatan siswa (bisa lebih dari satu)
  const [catatanList, setCatatanList] = useState([]);

  // ambil data sesi presensi guru dari localStorage
  const sesiBySchool = JSON.parse(localStorage.getItem("guru_sesi_by_school") || "{}");

  // ambil id_sesi yang aktif berdasarkan id sekolah
  const getActiveSesi = (id_sekolah) => sesiBySchool[id_sekolah]?.id_sesi;

  // load data awal
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        // jika sudah selesai hari ini, blok akses halaman & redirect
        if (isJadwalSelesaiHariIni(id_jadwal)) {
          alert("Jadwal ini sudah disimpan & selesai untuk hari ini.");
          navigate("/guru");
          return;
        }

        // ambil semua jadwal, cari jadwal yang id-nya sesuai 
        const all = await guruApi.getSemuaJadwal();
        const found = (all.data || []).find((j) => String(j.id_jadwal) === String(id_jadwal));
        if (!found) throw new Error("Jadwal tidak ditemukan");

        setJadwal(found);

        // ambil siswa berdasarkan id_kelas dari jadwal
        const resSiswa = await guruApi.getSiswaByKelas(found.id_kelas);
        setSiswa(resSiswa.data || []);
      } catch (e) {
        setError(e.message || "Gagal memuat data mengajar");
      } finally {
        setLoading(false);
      }
    })();
  }, [id_jadwal, navigate]);

  // set status absensi untuk siswa tertentu
  const setStatus = (id_siswa, status) => {
    setAbsensi((prev) => ({ ...prev, [id_siswa]: status }));
  };

  // tambah baris catatan baru
  const addCatatan = () => {
    setCatatanList((p) => [...p, { ...emptyCatatan }]);
  };

  // update isi catatan pada index tertentu
  const updateCatatan = (idx, key, value) => {
    setCatatanList((p) =>
      p.map((c, i) => (i === idx ? { ...c, [key]: value } : c))
    );
  };

  // hapus catatan berdasarkan index
  const removeCatatan = (idx) => {
    setCatatanList((p) => p.filter((_, i) => i !== idx));
  };

  // simpan semua data: absensi + jurnal + catatan siswa
  const handleSubmit = async () => {
    try {
      setError("");

      // mencegah submit ulang 
      if (isJadwalSelesaiHariIni(id_jadwal)) {
        throw new Error("Jadwal ini sudah disimpan & selesai untuk hari ini.");
      }

      if (!jurnal.materi_diajarkan.trim()) {
        throw new Error("Materi diajarkan wajib diisi");
      }

      // memastikan data jadwal sudah ada sebelum akses jadwal.id_sekolah
      if (!jadwal) throw new Error("Data jadwal belum siap");

      // ambil id_sesi_guru dari sesi sekolah yang sedang mengajar
      const id_sesi_guru = getActiveSesi(jadwal.id_sekolah);
      if (!id_sesi_guru) throw new Error("Sesi presensi guru tidak ditemukan");

      const tanggal = dayjs().format("YYYY-MM-DD");

      // absensi yang dikirim ke backend hanya yang tidak hadir (negatif)
      const ketidakhadiran = siswa
        .filter((s) => absensi[s.id_siswa] && absensi[s.id_siswa] !== "Hadir")
        .map((s) => ({
          id_siswa: s.id_siswa,
          status: absensi[s.id_siswa],
        }));

      if (ketidakhadiran.length > 0) {
        await guruApi.absensiSiswa({
          id_sesi_guru,
          id_jadwal,
          tanggal,
          ketidakhadiran,
        });
      }

      // simpan jurnal mengajar
      await guruApi.jurnal({
        id_sesi_guru,
        id_jadwal,
        materi_diajarkan: jurnal.materi_diajarkan,
        catatan_kegiatan: jurnal.catatan_kegiatan,
      });

      // simpan catatan siswa satu per satu 
      for (const c of catatanList) {
        if (!c.id_siswa || !c.deskripsi) continue;
        await guruApi.catatanSiswa({
          id_sesi_guru,
          id_siswa: c.id_siswa,
          jenis_catatan: c.jenis_catatan,
          deskripsi: c.deskripsi,
        });
      }

      // setelah sukses simpan, tandai jadwal selesai untuk hari ini
      markJadwalSelesaiHariIni(id_jadwal);

      alert("Kegiatan mengajar berhasil disimpan");
      navigate("/guru");
    } catch (e) {
      setError(e.message || "Gagal menyimpan kegiatan mengajar");
    }
  };

  return {
    loading,
    error,
    jadwal,
    siswa,
    STATUS_ABSENSI,
    absensi,
    setStatus,
    jurnal,
    setJurnal,
    catatanList,
    addCatatan,
    updateCatatan,
    removeCatatan,
    handleSubmit,
  };
}
