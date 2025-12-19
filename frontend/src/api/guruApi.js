import api from "./axiosClient";

export const guruApi = {
  checkin: (payload) => api.post("/guru/checkin", payload),     // {id_sekolah}
  checkout: (payload) => api.post("/guru/checkout", payload),   // {id_sekolah}

  getJadwalHariIni: (params) => api.get("/guru/jadwal-hari-ini", { params }),
  getSemuaJadwal: () => api.get("/guru/jadwal-semua"),

  absensiSiswa: (payload) => api.post("/guru/absensi-siswa", payload),
  jurnal: (payload) => api.post("/guru/jurnal", payload),
  catatanSiswa: (payload) => api.post("/guru/catatan-siswa", payload),

  getSiswaByKelas: (id_kelas) => api.get(`/guru/siswa/kelas/${id_kelas}`),

  reportGuru: (params) => api.get("/guru/report-guru", { params }),
};
