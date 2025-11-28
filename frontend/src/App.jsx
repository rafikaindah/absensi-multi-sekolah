import { useEffect } from "react";
import api from "./api/axiosClient";

function App() {

  useEffect(() => {
    const testAxios = async () => {
      try {
        console.log("🔍 Mengirim request ke backend...");

        const response = await api.get("/test"); // endpoint test backend 
        console.log("✅ API Berhasil:", response.data);
      } catch (error) {
        console.error("❌ API Error:", error);
      }
    };

    testAxios();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Frontend Berhasil Jalan</h1> 
    </div>
  );
}

export default App;
