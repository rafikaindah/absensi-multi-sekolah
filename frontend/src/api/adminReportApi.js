import api from "./axiosClient";

export const adminReportApi = {
  reportGuru: (params) => api.get("/guru/report-guru", { params }),
};
