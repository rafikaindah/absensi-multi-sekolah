const bcrypt = require('bcryptjs'); //mengimpor bcryptjs untuk hashing password

async function run() { // fungsi async untuk menjalankan kode
  const passwordPlain = 'password123'; // password yang akan di-hash
  const hash = await bcrypt.hash(passwordPlain, 10); // meng-hash password dengan salt rounds 10 (mengacak 10 kali)
  console.log('Hash:', hash);
}

run();
