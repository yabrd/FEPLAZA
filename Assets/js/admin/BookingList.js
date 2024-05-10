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