import "../Master.css";
import { useJadwalMengajarController } from "./jadwalmengajar.controller";
import { useOutletContext } from "react-router-dom";
import { useMemo } from "react";

export default function JadwalMengajarPage() {
  const c = useJadwalMengajarController();
  const { toggleSidebar } = useOutletContext();

  //grup data jadwal per sekolah
  const groupedBySekolah = useMemo(() => {
    const map = new Map();
    (c.filtered || []).forEach((r) => {
      const key = r.nama_sekolah || "-";
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    });

    return Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [c.filtered]);

  return (
    // halaman master data jadwal mengajar
    <div className="page">
      {/* header judul + search + tombol tambah */}
      <div className="page-header">
        <div>
          <div className="title-row">
            {/* tombol hamburger */}
            <button
              className="hamburger"
              onClick={toggleSidebar}
              aria-label="Buka / tutup menu"
            >
              ☰
            </button>
            <h1>Master Data Jadwal Mengajar</h1>
          </div>
        </div>

        <div className="actions">
          {/* input search cari nama guru / sekolah / kelas / mapel / hari */}
          <input
            className="search"
            placeholder="Cari nama guru / sekolah / kelas / mapel / hari..."
            value={c.q}
            onChange={(e) => c.setQ(e.target.value)}
          />
          {/* tombol tambah pendaftaran guru */}
          <button className="primary" onClick={c.openCreate}>
            + Tambah Jadwal
          </button>
        </div>
      </div>

      {/* pesan error */}
      {c.error && <div className="alert">{c.error}</div>}

      {c.loading ? (
        <div className="state">Memuat data...</div>
      ) : groupedBySekolah.length === 0 ? (
        <div className="state">Data kosong.</div>
      ) : (
        // tabel per sekolah
        groupedBySekolah.map(([namaSekolah, items]) => (
          <div key={namaSekolah} className="group-section">
          <h2 className="group-title">{namaSekolah}</h2>

            {/* card tabel jadwal untuk sekolah */}
            <div className="card">
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Nama Lengkap</th>
                      <th>Kelas</th>
                      <th>Mapel</th>
                      <th>Hari</th>
                      <th>Jam</th>
                      <th style={{ width: 180 }}>Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {/* baris jadwal per item */}
                    {items.map((r) => (
                      <tr key={r.id_jadwal}>
                        <td>{r.nama_guru}</td>
                        <td>{r.tingkat} {r.nama_kelas}</td>
                        <td>{r.nama_mapel}</td>
                        <td>{r.hari}</td>
                        <td>{r.jam_mulai} - {r.jam_selesai}</td>

                        {/* tombol aksi edit + hapus */}
                        <td className="row-actions">
                          <button className="btn" onClick={() => c.openEdit(r)}>
                            Edit
                          </button>
                          <button className="btn danger" onClick={() => c.handleDelete(r)}>
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ))
      )}

      {/* modal tambah/edit jadwal */}
      {c.openForm && (
        <div className="modal-backdrop" onMouseDown={c.closeForm}>
          <div
            className="modal"
            onMouseDown={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            {/* header modal */}
            <div className="modal-head">
              <div>
                <h2>{c.mode === "create" ? "Tambah Jadwal" : "Edit Jadwal"}</h2>
              </div>
              <button className="icon" onClick={c.closeForm} title="Tutup">
                ✕
              </button>
            </div>

            {/* form tambah/edit */}
            <form className="form" onSubmit={c.handleSubmit}>
              <div className="grid">
                <div className="field">
                  <label>Pendaftaran Guru</label>
                  <select
                    value={c.form.id_pendaftaran}
                    onChange={(e) => c.onChange("id_pendaftaran", e.target.value)}
                    required
                  >
                    <option value="">Pilih pendaftaran...</option>
                    {c.pendaftaran.map((pg) => (
                      <option key={pg.id_pendaftaran} value={String(pg.id_pendaftaran)}>
                        {pg.nama_lengkap} - {pg.nama_sekolah}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Kelas</label>
                  <select
                    value={c.form.id_kelas}
                    onChange={(e) => c.onChange("id_kelas", e.target.value)}
                    required
                  >
                    <option value="">Pilih kelas...</option>
                    {c.kelas.map((k) => (
                      <option key={k.id_kelas} value={String(k.id_kelas)}>
                        {k.tingkat} {k.nama_kelas}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Mata Pelajaran</label>
                  <select
                    value={c.form.id_mapel}
                    onChange={(e) => c.onChange("id_mapel", e.target.value)}
                    required
                  >
                    <option value="">Pilih mapel...</option>
                    {c.mapel.map((m) => (
                      <option key={m.id_mapel} value={String(m.id_mapel)}>
                        {m.nama_mapel}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label>Hari</label>
                  <input
                    value={c.form.hari}
                    onChange={(e) => c.onChange("hari", e.target.value)}
                    placeholder="Contoh: Senin"
                    required
                  />
                </div>

                <div className="field">
                  <label>Jam Mulai</label>
                  <input
                    type="time"
                    value={c.form.jam_mulai}
                    onChange={(e)=>c.onChange("jam_mulai", e.target.value)}
                    required
                  />
                </div>

                <div className="field">
                  <label>Jam Selesai</label>
                  <input
                    type="time"
                    value={c.form.jam_selesai}
                    onChange={(e) => c.onChange("jam_selesai", e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* tombol aksi modal */}
              <div className="modal-actions">
                <button type="button" className="btn" onClick={c.closeForm}>
                  Batal
                </button>
                <button type="submit" className="primary" disabled={c.saving}>
                  {c.saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
