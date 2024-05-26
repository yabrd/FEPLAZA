import { HistoryAndEditingModal } from "./modal.js";
import { formatRupiah } from './utils.js';
import { resetTable } from './DashboardAdmin.js';

let CurrentBookingHistoryTable = 1;
let CurrentBookingListTable = 1;

function displayBookingTable(BookingData, currentPage, Action) {
    let selectorTarget;
    let tableId;
    let pageInfoId;
    let prevButtonId;
    let nextButtonId;

    if (Action === 'apply') {
        selectorTarget = '#ListTableDisplay';
        tableId = 'NextBookingListTable';
        pageInfoId = 'PageListTable';
        prevButtonId = 'PrevBookingListTable';
        nextButtonId = 'NextBookingListTable';
    } else if (Action === 'edit') {
        selectorTarget = '#HistoryTableDisplay';
        tableId = 'NextBookingHistoryTable';
        pageInfoId = 'PageHistoryTable';
        prevButtonId = 'PrevBookingHistoryTable';
        nextButtonId = 'NextBookingHistoryTable';
    }

    const tableContainer = document.querySelector(selectorTarget);
    tableContainer.innerHTML = '';

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, BookingData.length);

    let displayedDataCount = 0; // Variable untuk menghitung data yang ditampilkan

    for (let i = 0; i < BookingData.length; i++) {
        const Booking = BookingData[i];

        // Pisahkan data menjadi dua kategori: list dan history
        const isListData = !Booking.order_layanan && !Booking.harga_booking;
        const isHistoryData = Booking.order_layanan && Booking.harga_booking;

        if ((Action === 'apply' && isListData) || (Action === 'edit' && isHistoryData)) {
            // Tampilkan hanya jika sesuai dengan kategori yang diproses
            if (displayedDataCount >= startIndex && displayedDataCount < endIndex) {
                let innerHTML = `
                    <td>${displayedDataCount + 1}</td>
                    <td>${Booking.nama_booking}</td>
                    <td>${Booking.nomerhp_booking}</td>
                    <td>${Booking.waktu_booking}</td>
                    <td>${Booking.tanggal_booking}</td>
                    <td>${Booking.pesan_booking}</td>
                `;

                if (Action === 'edit') {
                    innerHTML += `
                        <td>${Booking.order_layanan}</td>
                        <td>${formatRupiah(Booking.harga_booking)}</td>
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
            }

            displayedDataCount++; // Tambahkan hitungan data yang ditampilkan
        }
    }

    // Update pagination info
    document.getElementById(pageInfoId).innerText = `Page ${currentPage} / ${Math.ceil(displayedDataCount / itemsPerPage)}`;

    // Enable/Disable pagination buttons
    document.getElementById(prevButtonId).disabled = currentPage === 1;
    document.getElementById(nextButtonId).disabled = endIndex >= displayedDataCount;
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

        if (Action != 'add') {
            const checkboxes = document.querySelectorAll(`.service-checkboxs${BookingID}`);
            const totalHarga = {};
            totalHarga[BookingID] = 0;
    
            fetchOrderData(checkboxes, totalHarga, BookingID, Action);
        } else if (Action == 'add') {
            const totalHarga = {};
            totalHarga[BookingID] = 0;
            SetHargaCheckbox(BookingID, totalHarga, Action)
        }


    })
    .catch(error => {
        console.error('Error:', error);
    });
}


function SetHargaCheckbox(BookingID, totalHarga, Action) {
    var checkboxes = document.querySelectorAll(`.service-checkboxs${BookingID}`); // Perbaiki nama kelas
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            totalHarga[BookingID] = 0; // Reset total harga
            checkboxes.forEach(function(cb) {
                if (cb.checked) {
                    totalHarga[BookingID] += parseFloat(cb.getAttribute('data-harga'));
                }
            });
            var formattedHarga = 'Rp. ' + formatRupiah(totalHarga[BookingID].toFixed(0));
            document.getElementById(`TotalHarga${Action}${BookingID}`).textContent = 'Total Harga: ' + formattedHarga;

            // Periksa kembali apakah elemen harga sudah ada
            let hargaElement = document.getElementById(`Harga${Action}${BookingID}`);
            if (hargaElement) {
                hargaElement.value = totalHarga[BookingID];
            } else {
                let hargaContainer = document.getElementById(`TotalHarga${Action}${BookingID}`);
                let hargaElementBaru = document.createElement('input');
                hargaElementBaru.setAttribute('type', 'hidden');
                hargaElementBaru.setAttribute('id', `Harga${Action}${BookingID}`);
                hargaElementBaru.setAttribute('name', 'harga');
                hargaElementBaru.value = totalHarga[BookingID];
                hargaContainer.appendChild(hargaElementBaru);
            }
        });
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

function SubmitButton(BookingID, Action) {
    var MissingFieldsListId = `MissingFieldsList${Action}${BookingID}`;
    var AlertContainerId = `AlertContainer${Action}${BookingID}`;
    var SuccessAlertContainerId = `SuccessAlertContainer${Action}${BookingID}`;
    var ButtonId = `SubmitBtn${Action}${BookingID}`;
    var NamaFieldId = `Nama${Action}${BookingID}`;
    var NomerhpFieldId = `NomorHP${Action}${BookingID}`;
    var TanggalFieldId = `Tanggal${Action}${BookingID}`;
    var WaktuFieldId = `Waktu${Action}${BookingID}`;
    var PesanFieldId = `Pesan${Action}${BookingID}`;
    var Harga = `Harga${Action}${BookingID}`;

    var button = document.getElementById(ButtonId);
    var nama_booking = document.getElementById(NamaFieldId).value;
    var nomerhp_booking = document.getElementById(NomerhpFieldId).value;
    var tanggal = document.getElementById(TanggalFieldId).value;
    var waktu = document.getElementById(WaktuFieldId).value;
    var pesan = document.getElementById(PesanFieldId).value;
    var harga = document.getElementById(Harga).value;
    var checkboxes = document.getElementsByName(`services${BookingID}[]`);

    var selectedServices = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            selectedServices.push(checkboxes[i].value);
        }
    }

    var countSelectedServices = selectedServices.length;

    // Menonaktifkan tombol
    button.disabled = true;

    // Menunggu 5 detik sebelum mengaktifkan kembali tombol
    setTimeout(function() {
        button.disabled = false;
    }, 5000);

    var API;

    if (Action === 'apply' || Action === 'edit') {
        var CloseButtonId = `CloseModal${Action}${BookingID}`;
        API = `http://localhost/BEPLAZA/API/api.php/bookingUpdate/${BookingID}`;
    } else if (Action === 'add') {
        API = `http://localhost/BEPLAZA/API/api.php/booking-admin`;
    }

    var fieldsNotFilled = [];

    if (nama_booking === "") {
        fieldsNotFilled.push("Nama Booking");
    }
    if (nomerhp_booking === "") {
        fieldsNotFilled.push("Nomer HP Booking");
    }
    if (harga < 1 && countSelectedServices < 1) {
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
        document.getElementById(MissingFieldsListId).innerHTML = fieldsNotFilled.map(function(field) {
            return "<li>" + field + "</li>";
        }).join("");
        document.getElementById(AlertContainerId).classList.remove("d-none");
        setTimeout(function() {
            document.getElementById(AlertContainerId).classList.add("d-none"); 
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

    var jsonData = JSON.stringify(dataToSend);

    var xhr = new XMLHttpRequest();

    if (Action === 'add') {
        xhr.open("POST", API, true); // Mengubah ke POST untuk menambahkan booking baru
    } else {
        xhr.open("PUT", API, true); // Mengubah URL ke endpoint order
    }

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById(SuccessAlertContainerId).classList.remove("d-none");
            setTimeout(function() {
                window.location.href = '?Booking';
                document.getElementById(SuccessAlertContainerId).classList.add("d-none"); 
                document.getElementById(CloseButtonId).getElementsByClassName("close")[0].click();
                
            }, 2000); 
        } else {
            console.error("Gagal menambahkan booking:", xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error("Koneksi error.");
    };

    xhr.send(jsonData);
}


export { displayBookingTable, fetchAndDisplayServices, SubmitButton };