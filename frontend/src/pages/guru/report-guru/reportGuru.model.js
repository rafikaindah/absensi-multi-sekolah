import dayjs from "dayjs";

// default filter: 7 hari terakhir
export const defaultFilter = () => {
  const end = dayjs().format("YYYY-MM-DD");
  const start = dayjs().subtract(7, "day").format("YYYY-MM-DD");

  return { start, end, id_sekolah: "" };
};
