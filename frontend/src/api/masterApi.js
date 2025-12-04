import api from "./axiosClient";

export const masterApi = {
  // PENGGUNA
  getPengguna: () => api.get("/master/pengguna"),
  createPengguna: (payload) => api.post("/master/pengguna", payload),
  updatePengguna: (id, payload) => api.put(`/master/pengguna/${id}`, payload),
  deletePengguna: (id) => api.delete(`/master/pengguna/${id}`),
};
