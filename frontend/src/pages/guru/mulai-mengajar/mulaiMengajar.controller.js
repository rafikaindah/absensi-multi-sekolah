import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { guruApi } from "../../../api/guruApi";
import { STATUS_ABSENSI, emptyJurnal, emptyCatatan } from "./mulaiMengajar.model";

export function useMulaiMengajarController() {
  const { id_jadwal } = useParams();
  const navigate = useNavigate();

  // tanggal hari ini
  const [tanggalIni] = useState(() => dayjs().format("YYYY-MM-DD"));

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

  // mengecek apakah jadwal ini sudah ditandai selesai untuk hari ini
  const cekJadwalSelesaiHariIni = async () => {
    const res = await guruApi.getJadwalSelesaiHariIni({ tanggal: tanggalIni });
    const byJadwal = res.data?.byJadwal || {};
    const rec = byJadwal[String(id_jadwal)];
    return !!(rec && rec.selesai && rec.tanggal === tanggalIni);
  };

  // mengambil id_sesi_guru aktif dari backend (id_sekolah)
  const getActiveSesiFromBackend = async (id_sekolah) => {
    const res = await guruApi.getPresensiHariIni({ tanggal: tanggalIni });
    const bySchool = res.data?.bySchool || {};
    return bySchool[String(id_sekolah)]?.id_sesi || null;
  };

  // load data awal
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError("");

        // blok akses halaman kalau jadwal sudah selesai hari ini
        if (await cekJadwalSelesaiHariIni()) {
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

      if (await cekJadwalSelesaiHariIni()) {
        throw new Error("Jadwal ini sudah disimpan & selesai untuk hari ini.");
      }

      if (!jurnal.materi_diajarkan.trim()) {
        throw new Error("Materi diajarkan wajib diisi");
      }

      // memastikan data jadwal sudah ada sebelum akses jadwal.id_sekolah
      if (!jadwal) throw new Error("Data jadwal belum siap");

      // mengambil id_sesi_guru dari backend
      const id_sesi_guru = await getActiveSesiFromBackend(jadwal.id_sekolah);
      if (!id_sesi_guru) {
        throw new Error("Sesi presensi guru tidak ditemukan (pastikan sudah check-in)");
      }

      const tanggal = tanggalIni;

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
