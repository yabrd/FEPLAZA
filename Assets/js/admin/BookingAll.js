import { BookingModal } from "./modal.js";
import { formatRupiah } from './utils.js';
import { resetTable } from './DashboardAdmin.js';

let CurrentBookingHistoryTable = 1;
let CurrentBookingListTable = 1;

function displayBookingTable(BookingData, startIndex, isBookingListTable) {
    const tableContainer = document.querySelector(isBookingListTable ? '.tbody-dataBo' : '.BoSudahACC');
    tableContainer.innerHTML = '';

    let iteration = 1;

    for (let i = startIndex; i < BookingData.length; i++) {
        const Booking = BookingData[i];
        const hasPriceAndService = Booking.harga_booking === '' && Booking.order_layanan === '';

        if ((isBookingListTable && hasPriceAndService) || (!isBookingListTable && !hasPriceAndService)) {
            let innerHTML = `
                <td>${startIndex + iteration}</td>
                <td>${Booking.nama_booking}</td>
                <td>${Booking.nomerhp_booking}</td>
                <td>${Booking.waktu_booking}</td>
                <td>${Booking.tanggal_booking}</td>
                <td>${Booking.pesan_booking}</td>
            `;

            if (!isBookingListTable) {
                innerHTML += `
                    <td>${Booking.order_layanan}</td>
                    <td>${Booking.harga_booking}</td>
                    <td class="row">
                        <button class="btn-warning rounded mb-1 text-white" data-toggle="modal" data-target="#editModal${Booking.id_booking}">Edit</button>
                        <button id="deleteBtn${Booking.id_booking}" class="btn-danger rounded">Hapus</button>
                    </td>
                `;
            } else {
                innerHTML += `
                    <td><button class="btn-success rounded applyButton" data-toggle="modal" data-target="#bookingModal${Booking.id_booking}">APPLY</button></td>
                `;
            }

            const BookingElement = document.createElement('tr');
            BookingElement.innerHTML = innerHTML;
            tableContainer.appendChild(BookingElement);

            const modalElement = BookingModal(Booking, !isBookingListTable);
            document.body.appendChild(modalElement);

            fetchAndDisplayServices(Booking);

            if (!isBookingListTable) {
                const deleteButton = document.getElementById(`deleteBtn${Booking.id_booking}`);
                deleteButton.addEventListener('click', function() {
                    deleteBooking(Booking.id_booking);
                });
            }

            iteration++;
        }
    }

    const tableId = isBookingListTable ? 'NextBookingHistoryTable' : 'NextBookingListTable';
    document.getElementById(tableId).disabled = true;

    const totalPages = 1;
    const pageInfoId = isBookingListTable ? 'pageInfoTable2' : 'pageInfoTable1';
    document.getElementById(pageInfoId).innerText = `Page ${isBookingListTable ? CurrentBookingHistoryTable : CurrentBookingListTable} / ${totalPages}`;
}

function fetchAndDisplayServices(Booking) {
    const url = 'http://localhost/BEPLAZA/API/api.php/layanan';
    const orderUrl = `http://localhost/BEPLAZA/API/api.php/BookingOrder/${Booking.id_booking}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayServices(Booking, data);
            
            if (Booking.isHistory) {
                fetch(orderUrl)
                    .then(response => response.json())
                    .then(orderData => {
                        const checkboxes = document.querySelectorAll(`.service-checkboxs${Booking.id_booking}`);
                        const totalHarga = {};
                        totalHarga[Booking.id_booking] = 0;

                        const checkedServiceIds = orderData.map(order => order.id_pelayanan);

                        checkboxes.forEach(checkbox => {
                            const serviceId = parseInt(checkbox.value);
                            checkedServiceIds.forEach(idorder => {
                                if (idorder === serviceId) {
                                    checkbox.checked = true;
                                    updateTotalHarga(checkboxes, totalHarga, Booking.id_booking);
                                }
                            });
                        });

                        // Tambahkan event listener setelah menandai checkbox yang sesuai
                        checkboxes.forEach(function (checkbox) {
                            checkbox.addEventListener('change', function () {
                                updateTotalHarga(checkboxes, totalHarga, Booking.id_booking);
                            });
                        });
                    })
                    .catch(error => {
                        console.error('Error fetching order data:', error);
                    });
            }
        })
        .catch(error => {
            console.error('Error fetching layanan data:', error);
        });
}

function displayServices(Booking, layananData) {
    const layananContainer = document.createElement('div');
    layananContainer.innerHTML = `<label>Service</label>`;

    layananData.forEach(Layanan => {
        if ((Layanan.tampilkan === '1' && !Booking.isHistory) || Booking.isHistory) {
            const formattedNumber = new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(Layanan.harga);
            const layananElement = document.createElement('div');
            layananElement.classList.add('form-check');

            let labelContent = `${Layanan.nama} = Rp. ${formattedNumber}`;
            if (!Booking.isHistory && Layanan.tampilkan !== '1') {
                labelContent += ` <span class="text-danger">[ Tidak Ditampilkan ]</span>`;
            }

            layananElement.innerHTML = `
                <input class="form-check-input service-checkboxs${Booking.id_booking}" type="checkbox" name="services${Booking.id_booking}[]" value="${Layanan.id_pelayanan}" id="${Layanan.id_pelayanan}" data-hargas="${Layanan.harga}">
                <label class="form-check-label" for="service${Layanan.id_pelayanan}">${labelContent}</label>
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

function deleteBooking(booId) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        var button = document.getElementById(`deleteBtn${booId}`);

        button.disabled = true;
        setTimeout(function() {
            button.disabled = false;
        }, 5000);

        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "http://localhost/BEPLAZA/API/api.php/booking/" + booId, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if (xhr.status === 200) {
                document.getElementById(`successDelete`).classList.remove("d-none");
                resetTable();
                setTimeout(function() {
                    document.getElementById(`successDelete`).classList.add("d-none"); // Menambahkan kembali class d-none setelah alert ditampilkan
                }, 3000); 
            } else {
                document.getElementById(`gagalDelete`).classList.remove("d-none");
                setTimeout(function() {
                    document.getElementById(`gagalDelete`).classList.add("d-none"); // Menambahkan kembali class d-none setelah alert ditampilkan
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

export { displayBookingTable };