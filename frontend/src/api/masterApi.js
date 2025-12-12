import api from "./axiosClient";

export const masterApi = {
  // PENGGUNA
  getPengguna: () => api.get("/master/pengguna"),
  createPengguna: (payload) => api.post("/master/pengguna", payload),
  updatePengguna: (id, payload) => api.put(`/master/pengguna/${id}`, payload),
  deletePengguna: (id) => api.delete(`/master/pengguna/${id}`),

  //SEKOLAH
  getSekolah: () => api.get("/master/sekolah"),
  createSekolah: (payload) => api.post("/master/sekolah", payload),
  updateSekolah: (id, payload) => api.put(`/master/sekolah/${id}`, payload),
  deleteSekolah: (id) => api.delete(`/master/sekolah/${id}`),

  //KELAS
  getKelas: () => api.get("/master/kelas"),
  getKelasBySekolah: (id) => api.get(`/master/kelas/sekolah/${id}`),
  createKelas: (payload) => api.post("/master/kelas", payload),
  updateKelas: (id, payload) => api.put(`/master/kelas/${id}`, payload),
  deleteKelas: (id) => api.delete(`/master/kelas/${id}`),

  //SISWA
  getSiswa: () => api.get("/master/siswa"),
  getSiswaByKelas: (id_kelas) => api.get(`/master/siswa/kelas/${id_kelas}`),
  createSiswa: (payload) => api.post("/master/siswa", payload),
  updateSiswa: (id, payload) => api.put(`/master/siswa/${id}`, payload),
  deleteSiswa: (id) => api.delete(`/master/siswa/${id}`),

  //MATA PELAJARAN
  getMapel: () => api.get("/master/mapel"),
  createMapel: (payload) => api.post("/master/mapel", payload),
  updateMapel: (id, payload) => api.put(`/master/mapel/${id}`, payload),
  deleteMapel: (id) => api.delete(`/master/mapel/${id}`),

  // PENDAFTARAN GURU
  getPendaftaranGuru: () => api.get("/master/pendaftaran-guru"),
  createPendaftaranGuru: (payload) => api.post("/master/pendaftaran-guru", payload),
  updatePendaftaranGuru: (id, payload) => api.put(`/master/pendaftaran-guru/${id}`, payload),
  deletePendaftaranGuru: (id) => api.delete(`/master/pendaftaran-guru/${id}`),
};
