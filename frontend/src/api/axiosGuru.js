import axios from "axios"; //mengimpor library axios untuk HTTP request

const apiGuru = axios.create({ //membuat instance axios
  baseURL: "http://localhost:4000/api", //set URL dasar untuk semua permintaan API
});

apiGuru.interceptors.request.use((config) => { //menambahkan interceptor untuk setiap request
  const token = localStorage.getItem("token_guru"); //mengambil token guru dari localStorage
  if (token) config.headers.Authorization = `Bearer ${token}`; //menambahkan header Authorization jika token ada
  return config;
});

export default apiGuru; //mengekspor instance axios agar bisa digunakan di file lain