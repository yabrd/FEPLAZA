import { enableWaktu } from "./utils.js";

function createBookingForm() {
    // Mendapatkan elemen tempat Anda ingin menambahkan formulir
    var formContainer = document.getElementById('formContainer');

    // Menyiapkan HTML untuk formulir
    var formHTML = `
        <form role="form" name="bookingForm" id="bookingForm" method="post" class="booking-form">
            <!-- Bagian Pertama -->
            <div class="section section-1">
                <div class="form-group">
                    <label for="nama_booking">Nama</label>
                    <input type="text" id="nama" name="nama" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="tanggal">Tanggal</label>
                    <input type="date" id="tanggal" name="tanggal" required="required" class="form-control" data-validation-required-message="Silahkan masukan tanggal booking" required>
                </div>
            </div>
            <!-- Bagian Kedua -->
            <div class="section section-2">
                <div class="form-group">
                    <label for="nomerhp_booking">Nomor HP</label>
                    <input type="text" name="telp" id="telp" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="waktu">Waktu</label>
                    <select id="waktu" name="waktu" required="required" class="form-control" disabled>
                        <option value="" disabled selected>Pilih Tanggal Dahulu</option>
                    </select>
                </div>
            </div>
            <!-- Bagian Ketiga -->
            <div class="section section-3">
                <div class="form-group service-data "></div>
            </div>
            <!-- Bagian Keempat -->
            <div class="section section-4">
                <div class="form-group">
                    <label for="pesan">Pesan</label>
                    <textarea type="text" id="pesan" name="pesan" class="form-control" required></textarea>
                </div>
            </div>
            <!-- Bagian Kelima -->
            <div class="section section-5">
                <div class="form-group">
                    <div class="form-group service-data "></div>
                    <button id="submitBtn" class="btn btn-primary btn-block fw-bold text-black fs-5" type="button">Tambah Booking</button>
                </div>
            </div>
            <!-- Bagian Keenam -->
            <div class="section section-6">
                <div id="total-harga">
                    Total Harga: Rp. 0
                </div>
            </div>
        </form>
    `;

    // Menambahkan formulir ke dalam kontainer
    formContainer.innerHTML = formHTML;

    formContainer.querySelector(`#submitBtn`).addEventListener('click', function() {
        submitBookingAdm();
    });
        // Ambil elemen input tanggal
    var tanggalInput = document.getElementById("tanggal");

    // Tambahkan event listener untuk peristiwa change
    tanggalInput.addEventListener("change", enableWaktu);
}
// Memunculkan Referensi Pelanggan dari database
function ReverencePelanggan() {
    const url = 'http://localhost/BEPLAZA/API/api.php/User';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const PelangganContainer = document.querySelector('#datalist_nama');
        data.forEach(Pelanggan => {
            const PelangganOption = document.createElement('option');
            PelangganOption.value = Pelanggan.username;
            PelangganContainer.appendChild(PelangganOption);
        });
        // isi nomer telepon
        var namaInput = document.getElementsByName('nama')[0].value;
        var nomorInput = document.getElementById('telp');
        data.forEach(Pelanggan => {
            if(Pelanggan.username===namaInput){
                nomorInput.value = Pelanggan.no_telp;
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Menampilkan layanan yang tersedia pada halaman booking admin
function DataService() {
    const url = 'http://localhost/BEPLAZA/API/api.php/layanan';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const layananContainer = document.querySelector('.service-data');
        layananContainer.innerHTML = `
            <label>Service</label>
        `;

        data.forEach(Layanan => {
            if(Layanan.tampilkan === '1') {
            var formattedNumber = new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(Layanan.harga);
            const layananElement = document.createElement('div');
            layananElement.classList.add('form-check');
            layananElement.innerHTML = `
                <input class="form-check-input service-checkbox" type="checkbox" name="service[]" value="${Layanan.id_pelayanan}" id="${Layanan.id_pelayanan}" data-harga="${Layanan.harga}">
                <label class="form-check-label" for="service${Layanan.id_pelayanan}">${Layanan.nama} = Rp. ${formattedNumber} </label>
            `;
            layananContainer.appendChild(layananElement);
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
DataService();

function formatRupiah(angka) {
    var reverse = angka.toString().split('').reverse().join(''),
        ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');
    return ribuan;
}



setInterval(doSomethingWithCheckboxes, 1000);
var totalHarga = 0; 
function doSomethingWithCheckboxes() {
    var checkboxes = document.querySelectorAll('.service-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            totalHarga = 0;
            checkboxes.forEach(function(cb) {
                if (cb.checked) {
                    totalHarga += parseFloat(cb.getAttribute('data-harga'));
                }
            });
            var formattedHarga = 'Rp. ' + formatRupiah(totalHarga.toFixed(0));
            document.getElementById('total-harga').textContent = 'Total Harga: ' + formattedHarga;
            

        });
    });
    let hargaElement = document.getElementById('harga');
    if (hargaElement) {
        hargaElement.value = totalHarga;
    } else {
        let hargaContainer = document.querySelector('#total-harga');
        let hargaElementBaru = document.createElement('input');
        hargaElementBaru.setAttribute('type', 'hidden');
        hargaElementBaru.setAttribute('id', 'harga');
        hargaElementBaru.setAttribute('name', 'harga');
        hargaElementBaru.value = totalHarga;
        hargaContainer.appendChild(hargaElementBaru);
    }

}

function setMinDate() {
    var inputTanggal = document.getElementById('tanggal');
    if (inputTanggal) {
        
        var Hours = new Date();
        Hours.setHours(Hours.getHours() + 7);
        var today = Hours.toISOString().split('T')[0];
        inputTanggal.min = today;
    } else {
        setTimeout(setMinDate, 1000);
    }
}
setMinDate()

// Ketika mengklik tombol submit booking
function submitBookingAdm() {
    var button = document.getElementById("submitBtn");

    // Menonaktifkan tombol
    button.disabled = true;

    // Menunggu 5 detik sebelum mengaktifkan kembali tombol
    setTimeout(function() {
        button.disabled = false;
    }, 5000);


    var nama_booking = document.getElementById("nama").value;
    console.log("Nama Booking:", nama_booking);
    
    var nomerhp_booking = document.getElementById("telp").value;
    console.log("Nomor HP Booking:", nomerhp_booking);
    
    var tanggal = document.getElementById("tanggal").value;
    console.log("Tanggal:", tanggal);
    
    var waktu = document.getElementById("waktu").value;
    console.log("Waktu:", waktu);
    
    var pesan = document.getElementById("pesan").value;
    console.log("Pesan:", pesan);
    

    var checkboxes = document.getElementsByName("service[]");
    console.log("checkboxes:", checkboxes);

    var harga = document.getElementById("harga").value;
    console.log("Harga:", harga);
    
    var selectedServices = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            selectedServices.push(checkboxes[i].value);
        }
    }

    var countSelectedServices = selectedServices.length;

    var fieldsNotFilled = [];

    if (nama_booking === "") {
        fieldsNotFilled.push("Nama Booking");
    }
    if (nomerhp_booking === "") {
        fieldsNotFilled.push("Nomer HP Booking");
    }
    if (harga < 1 || countSelectedServices < 1 ) {
        fieldsNotFilled.push("Service");
    }
    if (tanggal === "") {
        fieldsNotFilled.push("Tanggal");
    }
    if (waktu === "") {
        fieldsNotFilled.push("Waktu");
    }
    if (pesan === "") {
        fieldsNotFilled.push("Pesan");
    }

    if (fieldsNotFilled.length > 0) {
        document.getElementById("missingFieldsList").innerHTML = fieldsNotFilled.map(function(field) {
            return "<li>" + field + "</li>";
        }).join("");
        document.getElementById("alertContainer").classList.remove("d-none");
        setTimeout(function() {
            document.getElementById("missingFieldsList").innerHTML = "";
            document.getElementById("alertContainer").classList.add("d-none");
        }, 5000);
        return;
    }

    var dataToSend = {
        "nama_booking": nama_booking,
        "nomerhp_booking": nomerhp_booking,
        "tanggal": tanggal,
        "waktu": waktu,
        "harga": harga,
        "pesan": pesan,
        "selectedServices": selectedServices // Menambahkan data selectedServices ke objek dataToSend
    };
    console.log(selectedServices)
    var jsonData = JSON.stringify(dataToSend);

    var xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost/BEPLAZA/API/api.php/booking-admin", true); // Mengubah URL ke endpoint order

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById("successAlertContainer").classList.remove("d-none");
            resetTable();
            resetForm();
            harga=0;
            countSelectedServices=0;
            setTimeout(function() {
                document.getElementById(`successAlertContainer`).classList.add("d-none"); // Menambahkan kembali class d-none setelah alert ditampilkan
            }, 5000); 
        } else {
            console.error("Gagal menambahkan booking:", xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error("Koneksi error.");
    };

    xhr.send(jsonData);
}

// Dipanggil setelah mengklik submit button
function resetForm() {
    document.getElementById("nama").value = "";
    document.getElementById("telp").value = "";
    document.getElementById("tanggal").value = "";
    document.getElementById("harga").value = "0";
    document.getElementById("waktu").value = "";
    document.getElementById("pesan").value = "";
    document.getElementById('total-harga').textContent = 'Total Harga: Rp. 0';
    var checkboxes = document.getElementsByName("service[]");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
}

export { createBookingForm }