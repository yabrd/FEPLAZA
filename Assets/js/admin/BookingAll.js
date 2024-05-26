import { HistoryAndEditingModal } from "./modal.js";
import { formatRupiah } from './utils.js';
import { resetTable } from './DashboardAdmin.js';

let CurrentBookingHistoryTable = 1;
let CurrentBookingListTable = 1;

function displayBookingTable(BookingData, startIndex, Action) {
    let selectorTarget;
    let tableId;
    let pageInfoId;
    
    if (Action === 'apply') {
        selectorTarget = '#ListTableDisplay';
        tableId = 'NextBookingListTable';
        pageInfoId = 'PageListTable';
    } else if (Action === 'edit') {
        selectorTarget = '#HistoryTableDisplay';
        tableId = 'NextBookingHistoryTable';
        pageInfoId = 'PageHistoryTable';
    }
    
    const tableContainer = document.querySelector(selectorTarget);
    tableContainer.innerHTML = '';

    let iteration = 1;

    for (let i = startIndex; i < BookingData.length; i++) {
        const Booking = BookingData[i];
        const NullPriceAndService = Booking.harga_booking === '' && Booking.order_layanan === '';

        if ((Action === 'apply' && NullPriceAndService) || (Action === 'edit' && !NullPriceAndService)) {
            let innerHTML = `
                <td>${startIndex + iteration}</td>
                <td>${Booking.nama_booking}</td>
                <td>${Booking.nomerhp_booking}</td>
                <td>${Booking.waktu_booking}</td>
                <td>${Booking.tanggal_booking}</td>
                <td>${Booking.pesan_booking}</td>
            `;

            if (Action === 'edit') {
                innerHTML += `
                    <td>${Booking.order_layanan}</td>
                    <td>${Booking.harga_booking}</td>
                    <td class="text-center">
                        <div class="btn-container">
                            <button class="btn btn-warning" data-toggle="modal" data-target="#Modal${Action}${Booking.id_booking}">Edit</button>
                            <button id="deleteBtn${Booking.id_booking}" class="btn btn-danger">Hapus</button>
                        </div>
                    </td>
                `;
            } else if (Action === 'apply') {
                innerHTML += `
                    <td class="text-center">
                        <div class="btn-container">
                            <button class="btn btn-success applyButton" data-toggle="modal" data-target="#Modal${Action}${Booking.id_booking}">APPLY</button>
                        </div>
                    </td>
                `;
            }


            const BookingElement = document.createElement('tr');
            BookingElement.innerHTML = innerHTML;
            tableContainer.appendChild(BookingElement);

            const modalElement = HistoryAndEditingModal(Booking, Action);
            document.body.appendChild(modalElement);

            fetchAndDisplayServices(Booking.id_booking, Action);

            if (Action === 'edit') {
                const deleteButton = document.getElementById(`deleteBtn${Booking.id_booking}`);
                deleteButton.addEventListener('click', function() {
                    deleteBooking(Booking.id_booking);
                });
            }
            iteration++;
        }
    }

    document.getElementById(tableId).disabled = true;

    const totalPages = 1;
    // document.getElementById(pageInfoId).innerText = `Page ${pageInfoId} / ${totalPages}`;
}

function fetchAndDisplayServices(BookingID, Action) {
    const url = 'http://localhost/BEPLAZA/API/api.php/layanan';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        const layananContainer = document.querySelector(`.service-data-container${BookingID}`);
        layananContainer.innerHTML = `<label>Service</label>`;

        data.forEach(Layanan => {
            const formattedNumber = new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFrActionDigits: 0 }).format(Layanan.harga);
            const layananElement = document.createElement('div');
            layananElement.classList.add('form-check');

            let labelContent = `${Layanan.nama} = Rp. ${formattedNumber}`;
            if (Layanan.tampilkan !== '1') {
                labelContent += ` <span class="text-danger">[ Tidak Ditampilkan ]</span>`;
            }

            layananElement.innerHTML = `
                <input class="form-check-input service-checkboxs${BookingID}" type="checkbox" name="services${BookingID}[]" value="${Layanan.id_pelayanan}" id="${Layanan.id_pelayanan}" data-harga="${Layanan.harga}">
                <label class="form-check-label" for="service${Layanan.id_pelayanan}">${labelContent}</label>
            `;
            layananContainer.appendChild(layananElement);
        });

        const checkboxes = document.querySelectorAll(`.service-checkboxs${BookingID}`);
        const totalHarga = {};
        totalHarga[BookingID] = 0;

        fetchOrderData(checkboxes, totalHarga, BookingID, Action);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function fetchOrderData(checkboxes, totalHarga, BookingID, Action) {
    const orderUrl = `http://localhost/BEPLAZA/API/api.php/BookingOrder/${BookingID}`;
    fetch(orderUrl).then(response => response.json())
    .then(orderData => {
        const checkedServiceIds = orderData.map(order => order.id_pelayanan);

        checkboxes.forEach(checkbox => {
            const serviceId = parseInt(checkbox.value);
            checkedServiceIds.forEach(idorder => {
                if (idorder == serviceId) {
                    checkbox.checked = true;
                    updateTotalHarga(checkboxes, totalHarga, BookingID, Action);
                }
            });
        });

        // Tambahkan event listener setelah menandai checkbox yang sesuai
        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                updateTotalHarga(checkboxes, totalHarga, BookingID, Action);
            });
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function updateTotalHarga(checkboxes, totalHarga, BookingID, Action) {
    totalHarga[BookingID] = 0;
    checkboxes.forEach(function(cb) {
        if (cb.checked) {
            totalHarga[BookingID] += parseFloat(cb.getAttribute('data-harga'));
        }
    });
    var formattedHarga = 'Rp. ' + formatRupiah(totalHarga[BookingID].toFixed(0));
    document.getElementById(`TotalHarga${Action}${BookingID}`).textContent = 'Total Harga: ' + formattedHarga;
    document.getElementById(`Harga${Action}${BookingID}`).value = totalHarga[BookingID];
}

function deleteBooking(BookingID) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        var button = document.getElementById(`deleteBtn${BookingID}`);

        button.disabled = true;
        setTimeout(function() {
            button.disabled = false;
        }, 5000);

        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "http://localhost/BEPLAZA/API/api.php/booking/" + BookingID, true);
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

export { displayBookingTable, fetchAndDisplayServices };