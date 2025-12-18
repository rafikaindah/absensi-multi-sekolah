export const emptyPresensiForm = {
  id_sekolah: "",
};

export const storageKeys = {
  activeSchool: "guru_active_school",
  sesiBySchool: "guru_sesi_by_school", // map: { [id_sekolah]: { id_sesi, tanggal, waktu_masuk, waktu_pulang } }

  selesaiByJadwal: "guru_selesai_by_jadwal", // map: { [id_jadwal]: { tanggal, selesai: true } }
};
