import axios from 'axios'; //mengimpor library axios untuk HTTP request

const api = axios.create({ //membuat instance axios
  baseURL: 'http://localhost:4000/api', //set URL dasar untuk semua permintaan API
});

api.interceptors.request.use((config) => { //menambahkan interceptor untuk setiap request
  const token = localStorage.getItem('token'); //mengambil token dari localStorage
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; //menambahkan header Authorization jika token ada
  }
  return config;
});

export default api; //mengekspor instance axios agar bisa digunakan di file lain
