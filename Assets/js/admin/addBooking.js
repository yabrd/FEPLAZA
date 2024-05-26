import { enableWaktu, setMinDate } from "./utils.js";
import { fetchAndDisplayServices } from "./BookingAll.js"
import { SubmitButton } from "./modal.js"

function createBookingForm(Action) {
    // Mendapatkan elemen tempat Anda ingin menambahkan formulir
    var formContainer = document.getElementById('formContainer');
    const BookingID = 1;
    const formId = `Form${Action}${BookingID}`;
    const idFieldId = `Id${Action}${BookingID}`;
    const namaFieldId = `Nama${Action}${BookingID}`;
    const nomorHPFieldId = `NomorHP${Action}${BookingID}`;
    const tanggalFieldId = `Tanggal${Action}${BookingID}`;
    const waktuFieldId = `Waktu${Action}${BookingID}`;
    const pesanFieldId = `Pesan${Action}${BookingID}`;
    const submitBtnId = `SubmitBtn${Action}${BookingID}`;
    const TotalHarga = `TotalHarga${Action}${BookingID}`;
    const Harga = `Harga${Action}${BookingID}`;

    // Menyiapkan HTML untuk formulir
    var formHTML = `
        <form role="form" name="${formId}" id="${formId}" method="post" class="booking-form">
            <!-- Bagian Pertama -->
            <div class="section section-1">
                <div class="form-group">
                    <label for="nama_booking">Nama</label>
                    <input type="text" id="${namaFieldId}" name="${namaFieldId}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="tanggal">Tanggal</label>
                    <input type="date" id="${tanggalFieldId}" name="${tanggalFieldId}" required="required" class="form-control" data-validation-required-message="Silahkan masukan tanggal booking" required>
                </div>
            </div>
            <!-- Bagian Kedua -->
            <div class="section section-2">
                <div class="form-group">
                    <label for="nomerhp_booking">Nomor HP</label>
                    <input type="text" name="${nomorHPFieldId}" id="${nomorHPFieldId}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="waktu">Waktu</label>
                    <select id="${waktuFieldId}" name="${waktuFieldId}" required="required" class="form-control" disabled>
                        <option value="" disabled selected>Pilih Tanggal Dahulu</option>
                    </select>
                </div>
            </div>
            <!-- Bagian Ketiga -->
            <div class="section section-3">
                <div class="form-group service-data-container${BookingID}"></div>
            </div>
            <!-- Bagian Keempat -->
            <div class="section section-4">
                <div class="form-group">
                    <label for="pesan">Pesan</label>
                    <textarea type="text" id="${pesanFieldId}" name="${pesanFieldId}" class="form-control" required></textarea>
                </div>
            </div>
            <!-- Bagian Kelima -->
            <div class="section section-5">
                <div class="form-group">
                    <div class="form-group service-data "></div>
                    <button id="${submitBtnId}" class="btn btn-primary btn-block fw-bold text-black fs-5" type="button">Tambah Booking</button>
                </div>
            </div>
            <!-- Bagian Keenam -->
            <div class="section section-6">
                <div id="${TotalHarga}">
                    Total Harga: Rp. 0
                </div>
            </div>
        </form>
    `;
    formContainer.innerHTML = formHTML;

    fetchAndDisplayServices(BookingID, Action);
    setMinDate(tanggalFieldId);

    var tanggalInput = document.getElementById(tanggalFieldId);
    tanggalInput.addEventListener("change", function() {
        enableWaktu(tanggalFieldId, waktuFieldId);
    });

    // var submitbutton = formContainer.querySelector(`#${submitBtnId}`);
    // submitbutton.addEventListener('click', function() {
    //     SubmitButton(BookingID, Action);
    // });
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

function formatRupiah(angka) {
    var reverse = angka.toString().split('').reverse().join(''),
        ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');
    return ribuan;
}

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

export { createBookingForm, setMinDate }