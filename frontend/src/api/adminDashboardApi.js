import api from "./axiosClient";

export const adminDashboardApi = {
  summary: () => api.get("/admin/dashboard/summary"),
  todayPresensiGuru: (params) => api.get("/admin/dashboard/today-presensi-guru", { params }),
  todayAbsensiSiswa: (params) => api.get("/admin/dashboard/today-absensi-siswa", { params }),
};
