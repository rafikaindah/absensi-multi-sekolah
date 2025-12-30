import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import "./QrScannerModal.css";

export default function QrScannerModal({ open, onClose, onScan, title = "Scan QR" }) {
  // menyimpan instance scanner agar bisa stop/clear
  const scannerRef = useRef(null);
  // id elemen tempat kamera ditampilkan
  const readerId = "qr-reader";

  // membuka modal dan melakukan scanner
  useEffect(() => {
    if (!open) return; 

    let html5QrCode;

    //start kamera dan scan QR
    const start = async () => {
      try {
        html5QrCode = new Html5Qrcode(readerId); 
        scannerRef.current = html5QrCode; 

        await html5QrCode.start(
          { facingMode: "environment" }, // menggunakan kamera belakang
          { fps: 10, qrbox: { width: 260, height: 260 } }, //set kecepatan scan dan area scan
          async (decodedText) => {
            //QR berhasil dibaca dan kirim hasil scan
            try {
              await scannerRef.current?.stop();
              await scannerRef.current?.clear();
            } catch {}
            scannerRef.current = null;

            onScan(decodedText); //kirim hasil scan ke halaman yang membuka modal
          },
          () => {} //QR belum kebaca
        );
      } catch (e) {
        //error jika kamera tidak bisa start
        console.error("QR start error:", e);
      }
    };

    start();

    //menutup modal
    return () => {
      const stop = async () => {
        try {
          if (scannerRef.current) {
            await scannerRef.current.stop();
            await scannerRef.current.clear();
          }
        } catch {}
        scannerRef.current = null;
      };
      stop();
    };
  }, [open, onScan]);

  if (!open) return null; //modal tertutup dan tidak melakukan render apa-apa

  return (
  <div className="qrmodal-backdrop" onClick={onClose}>
    {/* backdrop gelap full layar */}
    <div className="qrmodal" onClick={(e) => e.stopPropagation()}>
      {/* box modal utama */}
      <div className="qrmodal-head">
        {/* header modal (judul + close) */}
        <h3>{title}</h3>

        {/* tombol close */}
        <button className="qrmodal-close" onClick={onClose} aria-label="Tutup">
          ✕
        </button>
      </div>

      {/* container kamera/preview QR */}
      <div id={readerId} className="qrmodal-reader" />

      {/* teks petunjuk scan */}
      <div className="qrmodal-hint">
        Arahkan kamera ke QR sekolah sampai terbaca.
      </div>
    </div>
  </div>
);
}
