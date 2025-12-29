import api from "./axiosClient";

export const adminQrApi = {
  getQrSekolah: (uuid) => api.get(`/admin/qr/sekolah/${uuid}`),
};
