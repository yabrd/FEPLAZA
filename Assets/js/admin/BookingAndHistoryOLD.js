import { BookingModal } from "./modal.js";
import { formatRupiah } from './utils.js';
import { resetTable } from './DashboardAdmin.js';

let CurrentBookingHistoryTable = 1;

// (Berhasil)
function BookingHistoryTable(BookingData, startIndex) {
    const BookingACC = document.querySelector('.BoSudahACC');

    // Membersihkan tabel sebelum menambahkan data baru
    BookingACC.innerHTML = '';

    let iterasiACC = 1;

    for (let i = startIndex; i < BookingData.length; i++) {
        const Booking = BookingData[i];
        if (Booking.order_layanan && Booking.harga_booking) {
            const BookingElementACC = document.createElement('tr');
            BookingElementACC.innerHTML = `
                <td>${startIndex + iterasiACC}</td>
                <td>${Booking.nama_booking}</td>
                <td>${Booking.nomerhp_booking}</td>
                <td>${Booking.order_layanan}</td>
                <td>${Booking.waktu_booking}</td>
                <td>${Booking.tanggal_booking}</td>
                <td>${Booking.pesan_booking}</td>
                <td>${Booking.harga_booking}</td>
                <td class="row">
                    <button class="btn-warning rounded mb-1 text-white" data-toggle="modal" data-target="#editModal${Booking.id_booking}">Edit</button>
                    <button id="deleteBtn${Booking.id_booking}" class="btn-danger rounded">Hapus</button>
                </td>
            `;
            BookingACC.appendChild(BookingElementACC);
            iterasiACC++;

            const modalElement = BookingModal(Booking, true);
            document.body.appendChild(modalElement);
            fetchAndDisplayServices(Booking);
            
            const deleteButton = document.getElementById(`deleteBtn${Booking.id_booking}`);
            deleteButton.addEventListener('click', function() {
                deleteBooking(Booking.id_booking);
            });
        }
    }

    document.getElementById('NextBookingHistoryTable').disabled = true;
    document.getElementById('PrevBookingHistoryTable').disabled = true;

    const totalPages = 1;
    document.getElementById('pageInfoTable2').innerText = `Page ${CurrentBookingHistoryTable} / ${totalPages}`;
}


function fetchAndDisplayServices(Booking) {
    const url = 'http://localhost/BEPLAZA/API/api.php/layanan';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const layananContainer = document.querySelector(`.service-data-container${Booking.id_booking}`);
        layananContainer.innerHTML = `<label>Service</label>`;

        data.forEach(Layanan => {
            const formattedNumber = new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(Layanan.harga);
            const layananElement = document.createElement('div');
            layananElement.classList.add('form-check');

            let labelContent = `${Layanan.nama} = Rp. ${formattedNumber}`;
            if (Layanan.tampilkan !== '1') {
                labelContent += ` <span class="text-danger">[ Tidak Ditampilkan ]</span>`;
            }

            layananElement.innerHTML = `
                <input class="form-check-input service-checkboxs${Booking.id_booking}" type="checkbox" name="services${Booking.id_booking}[]" value="${Layanan.id_pelayanan}" id="${Layanan.id_pelayanan}" data-hargas="${Layanan.harga}">
                <label class="form-check-label" for="service${Layanan.id_pelayanan}">${labelContent}</label>
            `;
            layananContainer.appendChild(layananElement);
        });

        const checkboxes = document.querySelectorAll(`.service-checkboxs${Booking.id_booking}`);
        const totalHarga = {};
        totalHarga[Booking.id_booking] = 0;

        fetchOrderData(checkboxes, totalHarga, Booking.id_booking);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateTotalHarga(checkboxes, totalHarga, booId) {
    totalHarga[booId] = 0;
    checkboxes.forEach(function(cb) {
        if (cb.checked) {
            totalHarga[booId] += parseFloat(cb.getAttribute('data-hargas'));
        }
    });
    var formattedHarga = 'Rp. ' + formatRupiah(totalHarga[booId].toFixed(0));
    document.getElementById(`total-hargas${booId}`).textContent = 'Total Harga: ' + formattedHarga;
    document.getElementById(`hargas${booId}`).value = totalHarga[booId];
}

function fetchOrderData(checkboxes, totalHarga, booId) {
    const orderUrl = `http://localhost/BEPLAZA/API/api.php/BookingOrder/${booId}`;
    fetch(orderUrl).then(response => response.json())
    .then(orderData => {
        const checkedServiceIds = orderData.map(order => order.id_pelayanan);

        checkboxes.forEach(checkbox => {
            const serviceId = parseInt(checkbox.value);
            checkedServiceIds.forEach(idorder => {
                if (idorder == serviceId) {
                    checkbox.checked = true;
                    updateTotalHarga(checkboxes, totalHarga, booId);
                }
            });
        });

        // Tambahkan event listener setelah menandai checkbox yang sesuai
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                updateTotalHarga(checkboxes, totalHarga, booId);
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


// Berhasil
function deleteBooking(booId) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        var button = document.getElementById(`deleteBtn${booId}`);

        button.disabled = true;
        setTimeout(function() {
            button.disabled = false;
        }, 5000);

        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "http://localhost/BEPLAZA/API/api.php/booking/" + booId, true);
        console.log("After Delete");
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if (xhr.status === 200) {
                document.getElementById(`successDelete`).classList.remove("d-none");
                console.log("After none 1");
                resetTable();
                setTimeout(function() {
                    document.getElementById(`successDelete`).classList.add("d-none"); // Menambahkan kembali class d-none setelah alert ditampilkan
                    console.log("After none 2");
                }, 3000); 
            } else {
                document.getElementById(`gagalDelete`).classList.remove("d-none");
                console.log("After none 3");
                setTimeout(function() {
                    document.getElementById(`gagalDelete`).classList.add("d-none"); // Menambahkan kembali class d-none setelah alert ditampilkan
                    console.log("After none 4");
                }, 3000); 
                console.error("Gagal menghapus booking:", xhr.statusText);
            }
        };        
        xhr.onerror = function() {
            console.error("Koneksi error.");
        };
        xhr.send();
    }
}

export { BookingHistoryTable };


import { BookingModal } from "./modal.js";
import { formatRupiah } from './utils.js';

// Tambahkan variabel untuk melacak halaman saat ini
let CurrentBookingListTable = 1;
const itemsPerPage = 5; // Menentukan jumlah item per halaman

// Fungsi untuk menampilkan data Booking (Berhasil)
function BookingListTable(BookingData, startIndex) {
    const BookingContainer = document.querySelector('.tbody-dataBo');

    // Membersihkan tabel sebelum menambahkan data baru
    BookingContainer.innerHTML = '';

    // Menampilkan data yang memenuhi kondisi sesuai halaman dan indeks awal
    let iterasi = 1;
    for (let i = startIndex; i < BookingData.length; i++) {
        const Booking = BookingData[i];
        if (!Booking.order_layanan && !Booking.harga_booking) {
            const BookingElement = document.createElement('tr');
            BookingElement.innerHTML = `
                <td>${startIndex + iterasi}</td>
                <td>${Booking.nama_booking}</td>
                <td>${Booking.nomerhp_booking}</td>
                <td>${Booking.waktu_booking}</td>
                <td>${Booking.tanggal_booking}</td>
                <td>${Booking.pesan_booking}</td>
                <td><button class="btn-success rounded applyButton" data-toggle="modal" data-target="#bookingModal${Booking.id_booking}">APPLY</button></td>
            `;
            BookingContainer.appendChild(BookingElement);
            iterasi++;

            const modalElement = BookingModal(Booking, false);
            document.body.appendChild(modalElement);

            fetchLayananDataAndDisplayServices(Booking);
        }
    }

    // Menghilangkan pengecekan halaman dan mengubah status tombol Next/Prev
    document.getElementById('NextBookingListTable').disabled = true;
    document.getElementById('PrevBookingListTable').disabled = true;

    // Menampilkan informasi jumlah halaman (dalam hal ini tidak diperlukan)
    const totalPages = 1;
    document.getElementById('pageInfoTable1').innerText = `Page ${CurrentBookingListTable} / ${totalPages}`;
}

// Function untuk menampilkan data layanan (Berhasil)
function displayServices(Booking, layananData) {
    const layananContainer = document.createElement('div');
    layananContainer.innerHTML = `<label>Service</label>`;

    layananData.forEach(Layanan => {
        if (Layanan.tampilkan === '1') {
            var formattedNumber = new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(Layanan.harga);
            const layananElement = document.createElement('div');
            layananElement.classList.add('form-check');
            layananElement.innerHTML = `
                <input class="form-check-input service-checkboxs${Booking.id_booking}" type="checkbox" name="services${Booking.id_booking}[]" value="${Layanan.id_pelayanan}" id="${Layanan.id_pelayanan}" data-hargas="${Layanan.harga}">
                <label class="form-check-label" for="service${Layanan.id_pelayanan}">${Layanan.nama} = Rp. ${formattedNumber} </label>
            `;
            layananContainer.appendChild(layananElement);
        }
    });

    // Menambahkan container layanan ke dalam form
    const serviceDataContainer = document.querySelector(`.service-data-container${Booking.id_booking}`);
    serviceDataContainer.appendChild(layananContainer);

    var totalHargaPerBooking = 0;

    // Menambahkan event listener ke setiap checkbox
    var checkboxes = document.querySelectorAll(`.service-checkboxs${Booking.id_booking}`);
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            totalHargaPerBooking = 0;
            checkboxes.forEach(function(cb) {
                if (cb.checked) {
                    totalHargaPerBooking += parseFloat(cb.getAttribute('data-hargas'));
                }
            });
            var formattedHarga = 'Rp. ' + formatRupiah(totalHargaPerBooking.toFixed(0));
            document.getElementById(`total-hargas${Booking.id_booking}`).textContent = 'Total Harga: ' + formattedHarga;
            document.getElementById(`hargas${Booking.id_booking}`).value = totalHargaPerBooking;
        });
    });
}

// (Berhasil)
function fetchLayananDataAndDisplayServices(Booking) {
    const url = 'http://localhost/BEPLAZA/API/api.php/layanan';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayServices(Booking, data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

export { BookingListTable };