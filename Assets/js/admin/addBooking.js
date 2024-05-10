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
// ReverencePelanggan()

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
DataService()

// Menampilkan Data Service
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
setInterval(doSomethingWithCheckboxes, 1000);

function fetchGetBookedTimes(tanggal) {
    const tanggalFormatted = tanggal.split('-').join('');
    const url = `http://localhost/BEPLAZA/API/api.php/booking/${tanggalFormatted}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayBookedTimes(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayBookedTimes(bookedTimes) {
    // Data waktu yang tersedia
    const availableTimes = WatchData.filter(time => !bookedTimes.includes(time));

    // Menyimpan waktu yang tersedia ke dalam elemen select
    var waktuSelect = document.getElementById("waktu");
    waktuSelect.disabled = false;
    waktuSelect.innerHTML = "";

    availableTimes.forEach(function(waktu) {
        // Menghapus detik dari waktu
        var displayTime = waktu.slice(0);
        
        var option = document.createElement("option");
        option.text = displayTime;
        option.value = waktu;
        waktuSelect.add(option);
    });
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
    var nomerhp_booking = document.getElementById("telp").value;
    var tanggal = document.getElementById("tanggal").value;
    var waktu = document.getElementById("waktu").value;
    var pesan = document.getElementById("pesan").value;
    var harga = document.getElementById("harga").value;


    var checkboxes = document.getElementsByName("service[]");
    
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

// Menonaktifkan waktu yang sebelu tanggal saat ini
function enableWaktu() {
    var tanggalInput = document.getElementById("tanggal");
    var tanggal = tanggalInput.value;

    if (tanggal) {
        fetchGetBookedTimes(tanggal);
    } else {
        var waktuSelect = document.getElementById("waktu");
        waktuSelect.disabled = true;
        waktuSelect.innerHTML = "";
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
};