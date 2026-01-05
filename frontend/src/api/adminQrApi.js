import api from "./axiosAdmin";

export const adminQrApi = {
  getQrSekolah: (uuid) => api.get(`/admin/qr/sekolah/${uuid}`),
};
