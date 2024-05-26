// Fungsi untuk memeriksa kecocokan username dan password
async function validateCredentials(username, password) {
    try {
        // Mengenkripsi password menggunakan CryptoJS MD5
        const encryptedPassword = CryptoJS.MD5(password).toString();

        // Memanggil API untuk mendapatkan semua pelanggan
        const response = await fetch('http://localhost/PlazaBarbershop/API/api.php/pelangganLogin');
        if (!response.ok) {
            throw new Error('Failed to fetch pelanggan data');
        }
        const pelangganData = await response.json();

        // Memeriksa kecocokan username dan password
        const pelanggan = pelangganData.find(pelanggan => pelanggan.username === username && pelanggan.password === encryptedPassword);

        if (pelanggan) {
            const { id, username, no_telp, password } = pelanggan;
            return { id, username, no_telp, password };
        } else {
            return null; // Jika tidak ditemukan pengguna dengan username dan password yang sesuai
        }
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return null;
    }
}

// Fungsi untuk memeriksa kecocokan username dan password
async function validateCredentialsAdmin(username, password) {
    try {
        // Mengenkripsi password menggunakan CryptoJS MD5
        const encryptedPassword = CryptoJS.MD5(password).toString();

        // Memanggil API untuk mendapatkan semua pelanggan
        const response = await fetch('http://localhost/PlazaBarbershop/API/api.php/admin');
        if (!response.ok) {
            throw new Error('Failed to fetch admin data');
        }
        const adminData = await response.json();

        // Memeriksa kecocokan username dan password
        const admin = adminData.find(admin => admin.username === username && admin.password === encryptedPassword);

        if (admin) {
            const { id, username, no_telp, password } = admin;
            return { id, username, no_telp, password };
        } else {
            return null; // Jika tidak ditemukan pengguna dengan username dan password yang sesuai
        }
    } catch (error) {
        console.error('Error fetching data from API:', error);
        return null;
    }
}


// Fungsi untuk menambahkan pelanggan baru
async function addPelanggan(username, noTelp, password) {
    try {
        // Mengirim permintaan POST ke server
        const response = await fetch('http://localhost/PlazaBarbershop/API/api.php/pelanggan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                no_telp: noTelp,
                password: password
            })
        });
        if (!response.ok) {
            throw new Error('Failed to add pelanggan');
        }
        const data = await response.json();
        return data.success;
    } catch (error) {
        console.error('Error adding pelanggan:', error);
        return false;
    }
}

// Mengambil input dari form login
const loginForm = document.getElementById('LoginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Menghentikan pengiriman form secara default

        // Mendapatkan data form
        const formData = new FormData(this);
        const username = formData.get('username');
        const password = formData.get('password');

        // Memeriksa kecocokan username dan password
        const pelanggan = await validateCredentials(username, password);
        const admin = await validateCredentialsAdmin(username, password);

        if (pelanggan) {
            console.log('Login berhasil. Selamat datang, ' + pelanggan.username + '!');
            sessionStorage.setItem('id', pelanggan.id);
            sessionStorage.setItem('role', 'pelanggan');
            window.location.href = '../../FEPLAZA/?Beranda';
        }
        else if (admin) {
            console.log('Login berhasil. Selamat datang, ' + admin.username + '!');
            sessionStorage.setItem('id', admin.id);
            sessionStorage.setItem('role', 'admin');
            window.location.href = '../../FEPLAZA/Admin/?Booking';
        } else {
            console.log(username);
            console.log('Login gagal. Username atau password salah.');
            window.location.href = '';
        }
    });
}

// Mengambil input dari form registrasi
const registerForm = document.getElementById('RegisterForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Menghentikan pengiriman form secara default

        // Mendapatkan data form
        const formData = new FormData(this);
        const username = formData.get('username');
        const noTelp = formData.get('telp');
        const password = formData.get('password');

        // Menambahkan pelanggan baru
        const success = await addPelanggan(username, noTelp, password);

        if (success) {
            console.log('Pelanggan berhasil ditambahkan.');
            window.location.href = '?Login';
        } else {
            console.log('Gagal menambahkan pelanggan.');
            window.location.href = '';
        }
    });
}

function refreshCaptcha() {
    // Mendapatkan elemen gambar captcha
    var captchaImage = document.getElementById('captchaImage');

    // Menambahkan parameter timestamp untuk memaksa browser memuat ulang gambar captcha
    var timestamp = new Date().getTime();
    captchaImage.src = "captcha.php?timestamp=" + timestamp;
}