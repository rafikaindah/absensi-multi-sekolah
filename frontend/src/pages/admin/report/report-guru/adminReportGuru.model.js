import dayjs from "dayjs";

export const defaultFilter = () => {
  const end = dayjs().format("YYYY-MM-DD");
  const start = dayjs().subtract(7, "day").format("YYYY-MM-DD");
  return { start, end, id_sekolah: "", id_pengguna: "" };
};
