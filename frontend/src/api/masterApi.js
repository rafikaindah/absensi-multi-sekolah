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
};
