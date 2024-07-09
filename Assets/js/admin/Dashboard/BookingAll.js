import { historyAndEditingModal, getBookingData } from "./modalData.js";
import { formatRupiah } from './utils.js';
import { resetTable } from './dashboardAdmin.js';

function displayBookingTable(BookingData, currentPage, Action) {
    let selectorTarget;
    let pageInfoId;
    let prevButtonId;
    let nextButtonId;

    if (Action === 'apply') {
        selectorTarget = '#ListTableDisplay';
        pageInfoId = 'PageListTable'; 
        prevButtonId = 'PrevBookingListTable';
        nextButtonId = 'NextBookingListTable';
    } else if (Action === 'edit') {
        selectorTarget = '#HistoryTableDisplay';
        pageInfoId = 'PageHistoryTable';
        prevButtonId = 'PrevBookingHistoryTable';
        nextButtonId = 'NextBookingHistoryTable';
    }

    const tableContainer = document.querySelector(selectorTarget);
    tableContainer.innerHTML = '';

    const itemsPerPage = 5;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    let displayedDataCount = 0;
    let totalDisplayed = 0;

    for (let i = 0; i < BookingData.length; i++) {
        const Booking = BookingData[i];
        totalDisplayed++;

        if (displayedDataCount >= startIndex && displayedDataCount < endIndex) {
            let innerHTML = `
                <tr>
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
                            <button id="${Action}Btn${Booking.id_booking}" class="btn btn-warning" data-toggle="modal" data-target="#Modal${Action}${Booking.id_booking}">Ubah</button>
                            <button id="deleteBtn${Booking.id_booking}" class="btn btn-danger">Hapus</button>
                        </div>
                    </td>
                `;
            } else if (Action === 'apply') {
                innerHTML += `
                    <td class="text-center">
                        <div class="btn-container">
                            <button id="${Action}btn${Booking.id_booking}" class="btn btn-success applyButton" data-toggle="modal" data-target="#Modal${Action}${Booking.id_booking}">Konfirmasi</button>
                            <button id="deleteBtn${Booking.id_booking}" class="btn btn-danger">Hapus</button>
                        </div>
                    </td>
                `;
            }
            innerHTML += '</tr>';

            tableContainer.insertAdjacentHTML('beforeend', innerHTML);

            const modalElement = historyAndEditingModal(Booking, Action);
            document.body.appendChild(modalElement);

            fetchAndDisplayServices(Booking.id_booking, Action);

            const editButton = document.getElementById(`editBtn${Booking.id_booking}`);
            if (editButton) {
                editButton.addEventListener('click', function() {
                    getBookingData(Booking.id_booking, Action);
                });
            }
            
            const deleteButton = document.getElementById(`deleteBtn${Booking.id_booking}`);
            if (deleteButton) {
                deleteButton.addEventListener('click', function() {
                    deleteBooking(Booking.id_booking, Action);
                });
            }
        }

        displayedDataCount++;
    }

    document.getElementById(pageInfoId).innerText = `Page ${currentPage} / ${Math.ceil(totalDisplayed / itemsPerPage)}`;

    const prevButton = document.getElementById(prevButtonId);
    const nextButton = document.getElementById(nextButtonId);

    if (prevButton) {
        prevButton.disabled = currentPage === 1;
    }

    if (nextButton) {
        nextButton.disabled = endIndex >= totalDisplayed;
    }
}

async function fetchAndDisplayServices(BookingID, Action) {
    try {
        const url = 'https://beplazabarber.my.id/API/api.php/layanan';
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Failed to fetch services');
        }

        const data = await response.json();
        const layananContainer = document.querySelector(`.service-data-container${BookingID}`);
        layananContainer.innerHTML = `<label>Layanan</label>`;

        data.forEach(Layanan => {
            if (Layanan.tampilkan === '1') { // Only display if 'tampilkan' is '1'
                const formattedNumber = new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(Layanan.harga);
                const layananElement = document.createElement('div');
                layananElement.classList.add('form-check');

                layananElement.innerHTML = `
                    <input class="form-check-input service-checkboxs${BookingID}" type="checkbox" name="services${BookingID}[]" value="${Layanan.id}" id="${Layanan.id}" data-harga="${Layanan.harga}">
                    <label class="form-check-label" for="service${Layanan.id_pelayanan}">${Layanan.nama} = Rp. ${formattedNumber}</label>
                `;
                layananContainer.appendChild(layananElement);
            }
        });

        if (Action !== 'add') {
            const checkboxes = document.querySelectorAll(`.service-checkboxs${BookingID}`);
            const totalHarga = {};
            totalHarga[BookingID] = 0;
    
            fetchOrderData(checkboxes, totalHarga, BookingID, Action);
        } else {
            const totalHarga = {};
            totalHarga[BookingID] = 0;
            SetHargaCheckbox(BookingID, totalHarga, Action);
        }

    } catch (error) {
        console.error('Error fetching services:', error);
    }
}


function SetHargaCheckbox(BookingID, totalHarga, Action) {
    var checkboxes = document.querySelectorAll(`.service-checkboxs${BookingID}`);
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            totalHarga[BookingID] = 0;
            checkboxes.forEach(function(cb) {
                if (cb.checked) {
                    totalHarga[BookingID] += parseFloat(cb.getAttribute('data-harga'));
                }
            });
            var formattedHarga = 'Rp. ' + formatRupiah(totalHarga[BookingID].toFixed(0));
            document.getElementById(`TotalHarga${Action}${BookingID}`).textContent = 'Total Harga: ' + formattedHarga;

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

async function fetchOrderData(checkboxes, totalHarga, BookingID, Action) {
    try {
        const orderUrl = `https://beplazabarber.my.id/API/api.php/BookingOrder/${BookingID}`;
        const response = await fetch(orderUrl);

        if (!response.ok) {
            throw new Error('Failed to fetch order data');
        }

        const orderData = await response.json();
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

        checkboxes.forEach(function (checkbox) {
            checkbox.addEventListener('change', function () {
                updateTotalHarga(checkboxes, totalHarga, BookingID, Action);
            });
        });

    } catch (error) {
        console.error('Error fetching order data:', error);
    }
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

async function deleteBooking(BookingID, Action) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        const button = document.getElementById(`deleteBtn${BookingID}`);

        if (button) {
            button.disabled = true;
            setTimeout(function() {
                button.disabled = false;
            }, 5000);

            try {
                const response = await fetch(`https://beplazabarber.my.id/API/api.php/booking/${BookingID}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to delete booking');
                }

                const data = await response.json();

                const successAlert = document.getElementById(`${Action}SuccessDelete`);
                if (successAlert) {
                    successAlert.classList.remove("d-none");
                    resetTable();
                    setTimeout(function() {
                        successAlert.classList.add("d-none");
                    }, 3000);
                }
            } catch (error) {
                const errorAlert = document.getElementById(`${Action}GagalDelete`);
                if (errorAlert) {
                    errorAlert.classList.remove("d-none");
                    setTimeout(function() {
                        errorAlert.classList.add("d-none");
                    }, 3000);
                }
                console.error("Gagal menghapus booking:", error.message);
            }
        }
    }
}

async function SubmitButton(BookingID, Action) {
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
    var nama_booking = document.getElementById(NamaFieldId)?.value || "";
    var nomerhp_booking = document.getElementById(NomerhpFieldId)?.value || "";
    var tanggal = document.getElementById(TanggalFieldId)?.value || "";
    var waktu = document.getElementById(WaktuFieldId)?.value || "";
    var pesan = document.getElementById(PesanFieldId)?.value || "";
    var harga = document.getElementById(Harga)?.value || 0;
    var checkboxes = document.getElementsByName(`services${BookingID}[]`);

    var selectedServices = [];
    for (var i = 0; i < checkboxes.length; i++) {
        if (checkboxes[i].checked) {
            selectedServices.push(checkboxes[i].value);
        }
    }

    var countSelectedServices = selectedServices.length;
    console.log(countSelectedServices);

    var namaValid = /^[A-Za-z\s]+$/.test(nama_booking);
    var nomerhpValid = /^\d{10,}$/.test(nomerhp_booking);
    
    button.disabled = true;

    setTimeout(function() {
        button.disabled = false;
    }, 5000);

    var API;

    if (Action === 'apply' || Action === 'edit') {
        var CloseButtonId = `CloseModal${Action}${BookingID}`;
        API = `https://beplazabarber.my.id/API/api.php/bookingUpdate/${BookingID}`;
    } else if (Action === 'add') {
        API = `https://beplazabarber.my.id/API/api.php/booking-admin`;
    }

    var fieldsNotFilled = [];

    if (!namaValid) {
        fieldsNotFilled.push("Nama Booking hanya boleh berisi huruf dan spasi");
    }
    if (!nomerhpValid) {
        fieldsNotFilled.push("Nomor HP Booking hanya boleh berupa angka dan minimal 10 digit");
    }
    if (countSelectedServices < 1) {
        fieldsNotFilled.push("Service");
    }
    if (!tanggal) {
        fieldsNotFilled.push("Tanggal");
    }
    if (!waktu) {
        fieldsNotFilled.push("Waktu");
    }
    if (!pesan) {
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
        "selectedServices": selectedServices
    };

    var jsonData = JSON.stringify(dataToSend);

    try {
        const response = await fetch(API, {
            method: Action === 'add' ? 'POST' : 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });

        if (!response.ok) {
            throw new Error('Failed to add or update booking');
        }

        document.getElementById(SuccessAlertContainerId).classList.remove("d-none");
        setTimeout(function() {
            window.location.href = '?Dashboard';
            document.getElementById(SuccessAlertContainerId).classList.add("d-none"); 
            document.getElementById(CloseButtonId).getElementsByClassName("close")[0].click();
        }, 2000); 
    } catch (error) {
        console.error("Gagal menambahkan atau mengubah booking:", error.message);
    }
}

export { displayBookingTable, fetchAndDisplayServices, SubmitButton };