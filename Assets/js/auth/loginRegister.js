// Fungsi untuk memeriksa kecocokan username dan password
async function validateCredentials(username, password) {
    try {
        // Mengenkripsi password menggunakan CryptoJS MD5
        const encryptedPassword = CryptoJS.MD5(password).toString();

        // Memanggil API untuk mendapatkan semua pelanggan
        // const response = await fetch('http://localhost/BEPLAZA/API/api.php/UserLogin');
        const response = await fetch('https://beplazabarber.my.id/API/api.php/UserLogin');
        if (!response.ok) {
            throw new Error('Failed to fetch pelanggan data');
        }
        const pelangganData = await response.json();
        // Memeriksa kecocokan username dan password
        const pelanggan = pelangganData.find(pelanggan => pelanggan.username === username && pelanggan.password === encryptedPassword);

        if (pelanggan) {
            const { userID, username, no_telp, userRole, password } = pelanggan;
            return { userID, username, no_telp, userRole, password };
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
        // const response = await fetch('http://localhost/BEPLAZA/API/api.php/User', {
        const response = await fetch('https://beplazabarber.my.id/API/api.php/User', {
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
        const user = await validateCredentials(username, password);

        if (user){
            if (user.userRole === 'pelanggan') {
                console.log('Login berhasil. Selamat datang, ' + user.username + '!');
                sessionStorage.setItem('id', user.userID);
                sessionStorage.setItem('role', user.userRole);
                showAlert('success', `Login berhasil. Selamat datang, ${user.username}!`);
                setTimeout(() => {
                    window.location.href = '../../FEPLAZA/?Booking';
                }, 2000); // 2000 milidetik (2 detik) sebelum redirect
            }
            else if (user.userRole === 'admin') {
                console.log('Login berhasil. Selamat datang, ' + user.username + '!');
                sessionStorage.setItem('id', user.id);
                sessionStorage.setItem('role', 'admin');
                showAlert('success', `Login berhasil. Selamat datang, ${user.username}!`);
                setTimeout(() => {
                    window.location.href = '../../FEPLAZA/Admin/?Dashboard';
                }, 2000); // 2000 milidetik (2 detik) sebelum redirect
            }
        }else {
            // Login gagal, tampilkan pesan alert
            this.reset();
            showAlert('danger', 'Login gagal. Username atau password salah.');
        }
    });
}

// Mengambil input dari form registrasi
const registerForm = document.getElementById('RegisterForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function (event) {
        event.preventDefault(); // Menghentikan pengiriman form secara default

        const formData = new FormData(this);
        const username = formData.get('username');
        const noTelp = formData.get('telp');
        const password = formData.get('password');
        const confirmPassword = formData.get('confirmPassword');

        if (password === confirmPassword) {
            const isUsernameAvailable = await validationRegister(username);
            if (isUsernameAvailable) {
                const success = await addPelanggan(username, noTelp, password);
                if (success) {
                    console.log('Pelanggan berhasil ditambahkan.');
                    showAlert('success', `Registrasi berhasil. Akun ${username} sudah dapat digunakan!`);
                    setTimeout(() => {
                        window.location.href = '?Login';
                    }, 2000); // 2000 milidetik (2 detik) sebelum redirect
                } else {
                    registerForm.reset();
                    showAlert('danger', `Gagal menambahkan pelanggan.`);
                }
            } else {
                registerForm.reset();
                showAlert('danger', `Registrasi Gagal. Username ${username} sudah digunakan!`);
            }
        } else {
            registerForm.reset();
            showAlert('danger', `Registrasi Gagal. Password tidak sesuai dengan Confirm Password!`);
        }
    });
}

async function validationRegister(usernameRegister) {
    const response = await fetch('https://beplazabarber.my.id/API/api.php/User');
    if (!response.ok) {
        throw new Error('Gagal mendapatkan data pelanggan dari API.');
    }
    const pelangganData = await response.json();
    const pelanggan = pelangganData.find(pelanggan => pelanggan.username === usernameRegister);
    return !pelanggan; // Mengembalikan true jika username tersedia
}

function showAlert(type, message) {
    const alertMessage = document.getElementById('alertMessage');
    alertMessage.textContent = message;
    alertMessage.style.display = 'block';

    if (type === 'success') {
        alertMessage.classList.add('alert-success');
        alertMessage.classList.remove('alert-danger');
    } else if (type === 'danger') {
        alertMessage.classList.add('alert-danger');
        alertMessage.classList.remove('alert-success');
    }

    // Hilangkan pesan alert setelah beberapa detik (opsional)
    setTimeout(() => {
        alertMessage.style.display = 'none';
    }, 3000); // 3 detik
}

function refreshCaptcha() {
    // Mendapatkan elemen gambar captcha
    var captchaImage = document.getElementById('captchaImage');

    // Menambahkan parameter timestamp untuk memaksa browser memuat ulang gambar captcha
    var timestamp = new Date().getTime();
    captchaImage.src = "captcha.php?timestamp=" + timestamp;
}