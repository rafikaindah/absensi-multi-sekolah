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
};
