import { resetTable } from './DashboardAdmin.js';

function HistoryAndEditingModal(Booking, Action) {
    const modalElement = document.createElement('div');

    const BooID = Booking.id_booking;

    const modalId = `Modal${Action}${BooID}`;
    const closeModalId = `CloseModal${Action}${BooID}`;
    const alertContainerId = `AlertContainer${Action}${BooID}`;
    const missingFieldsListId = `MissingFieldsList${Action}${BooID}`;
    const successAlertContainerId = `SuccessAlertContainer${Action}${BooID}`;
    const formId = `Form${Action}${BooID}`;
    const idFieldId = `Id${Action}${BooID}`;
    const namaFieldId = `Nama${Action}${BooID}`;
    const nomorHPFieldId = `NomorHP${Action}${BooID}`;
    const tanggalFieldId = `Tanggal${Action}${BooID}`;
    const waktuFieldId = `Waktu${Action}${BooID}`;
    const pesanFieldId = `Pesan${Action}${BooID}`;
    const submitBtnId = `SubmitBtn${Action}${BooID}`;
    const TotalHarga = `TotalHarga${Action}${BooID}`;
    const Harga = `Harga${Action}${BooID}`;
    const modalTitle = Action;
    const submitBtnText = Action;

    modalElement.innerHTML = `
        <div class="modal fade" id="${modalId}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">${modalTitle}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="${closeModalId}">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="${alertContainerId}" class="mt-3 d-none">
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Perhatian!</strong> Ada field yang belum terisi:
                                <ul id="${missingFieldsListId}" class="mb-0"></ul>
                            </div>
                        </div>
                        <div id="${successAlertContainerId}" class="mt-3 d-none">
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                ${Action === 'edit' ? 'Berhasil Mengubah Data Booking!' : 'Berhasil Apply Booking!'}
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                        <form role="form" name="${formId}" id="${formId}" method="post">
                            <input type="hidden" id="${idFieldId}" value="${Booking.id_booking}">
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="${namaFieldId}">Nama</label>
                                    <input type="text" id="${namaFieldId}" name="nama" autocomplete="off" class="form-control" ${Action === 'edit' ? `list="datalist_nama${Booking.id_booking}" onchange="editReverencePelanggan(${Booking.id_booking})"` : ''} required value="${Booking.nama_booking}" ${Action === 'edit' ? '' : 'disabled'}>
                                </div>
                                ${Action === 'edit' ? `<datalist id="datalist_nama${Booking.id_booking}"></datalist>` : ''}
                                <div class="form-group col-md-6">
                                    <label for="${nomorHPFieldId}">Nomor HP</label>
                                    <input type="text" name="telp" id="${nomorHPFieldId}" class="form-control" required value="${Booking.nomerhp_booking}" ${Action === 'edit' ? '' : 'disabled'}>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="${tanggalFieldId}">Tanggal</label>
                                    <input type="date" id="${tanggalFieldId}" name="tanggal" required class="form-control" ${Action === 'edit' ? '' : 'readonly'} value="${Booking.tanggal_booking}">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="${waktuFieldId}">Waktu</label>
                                    ${Action === 'edit' ? `<input type="text" id="${waktuFieldId}" name="waktu" class="form-control" required value="${Booking.waktu_booking}">` : `
                                    <select id="${waktuFieldId}" name="waktu" required="required" class="form-control" disabled>
                                        <option selected>${Booking.waktu_booking}</option>
                                    </select>`}
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="${pesanFieldId}">Pesan</label>
                                <input type="text" id="${pesanFieldId}" name="pesan" class="form-control" required value="${Booking.pesan_booking}" ${Action === 'edit' ? '' : 'disabled'}>
                            </div>
                            <div class="form-group service-data-container${Booking.id_booking}">
                        
                            </div>
                            <div id="${TotalHarga}">
                                Total Harga: Rp. 0
                            </div>
                            <input type="hidden" id="${Harga}" name="harga" value="${Booking.pesan_booking}">
                            <button id="${submitBtnId}" class="btn btn-primary btn-block fw-bold text-black fs-5" type="button">${submitBtnText}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    modalElement.querySelector(`#${submitBtnId}`).addEventListener('click', function() {
        SubmitButton(Booking.id_booking, Action);
    });

    modalElement.querySelector(`#${closeModalId}`).addEventListener('click', function() {
        resetTable();
    });

    return modalElement;
}

function SubmitButton(booId, Action) {

    var CloseButtonId = `CloseModal${Action}${booId}`;
    var ButtonId = `SubmitBtn${Action}${booId}`;
    var IdFieldId = `Id${Action}${booId}`;
    var NamaFieldId = `Nama${Action}${booId}`;
    var NomerhpFieldId = `NomorHP${Action}${booId}`;
    var TanggalFieldId = `Tanggal${Action}${booId}`;
    var WaktuFieldId = `Waktu${Action}${booId}`;
    var PesanFieldId = `Pesan${Action}${booId}`;
    var MissingFieldsListId = `MissingFieldsList${Action}${booId}`;
    var AlertContainerId = `AlertContainer${Action}${booId}`;
    var SuccessAlertContainerId = `SuccessAlertContainer${Action}${booId}`;
    var Harga = `Harga${Action}${booId}`;

    var button = document.getElementById(ButtonId);
    console.log('idFieldId:', IdFieldId);

    // Menonaktifkan tombol
    button.disabled = true;

    // Menunggu 5 detik sebelum mengaktifkan kembali tombol
    setTimeout(function() {
        button.disabled = false;
    }, 5000);

    var id = document.getElementById(IdFieldId).value;
    var nama_booking = document.getElementById(NamaFieldId).value;
    var nomerhp_booking = document.getElementById(NomerhpFieldId).value;
    var tanggal = document.getElementById(TanggalFieldId).value;
    var waktu = document.getElementById(WaktuFieldId).value;
    var pesan = document.getElementById(PesanFieldId).value;
    var harga = document.getElementById(Harga).value;

    var checkboxes = document.getElementsByName(`services${booId}[]`);
    
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
        if (isEdit === true){
            setTimeout(function() {
                document.getElementById(AlertContainerId).classList.add("d-none"); 
            }, 5000); 
        }
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

    xhr.open("PUT", "http://localhost/BEPLAZA/API/api.php/bookingUpdate/"+id, true); // Mengubah URL ke endpoint order

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

// Menyimpan data Referensi (Kayaknya ya) 
function editReverencePelanggan(BooId) {
    const url = 'http://localhost/BEPLAZA/API/api.php/User';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const PelangganContainer = document.querySelector(`#editdatalist_nama${BooId}`);
        data.forEach(Pelanggan => {
            const PelangganOption = document.createElement('option');
            PelangganOption.value = Pelanggan.username;
            PelangganContainer.appendChild(PelangganOption);
        });
        // isi nomer telepon
        var namaInput = document.getElementsByName(`editNama${BooId}`)[0].value;
        var nomorInput = document.getElementById(`editNomorHPModal${BooId}`);
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

export { HistoryAndEditingModal };