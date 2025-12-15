import dayjs from "dayjs";

export const todayHariIndo = () => {
  const idx = dayjs().day();
  const namaHari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return namaHari[idx];
};
