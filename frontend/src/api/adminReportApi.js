import api from "./axiosAdmin";

export const adminReportApi = {
  reportGuru: (params) => api.get("/guru/report-guru", { params }),
  reportSiswa: (params) => api.get("/guru/report-siswa", { params }),

  getSekolahByGuru: (id_pengguna) => api.get(`/guru/sekolah/guru/${id_pengguna}`),
};
