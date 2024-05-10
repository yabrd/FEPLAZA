import { resetTable } from './DashboardAdmin.js';

function BookingModal(Booking, isEditing) {
    const modalElement = document.createElement('div');
    const modalTitle = isEditing ? 'Edit Booking' : 'Booking Details';
    const submitBtnText = isEditing ? 'Simpan Perubahan' : 'Simpan';

    modalElement.innerHTML = `
        <div class="modal fade" id="${isEditing ? 'editModal' : 'bookingModal'}${Booking.id_booking}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">${modalTitle}</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="${isEditing ? 'closeEditModal' : 'closeBookingModal'}${Booking.id_booking}">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="${isEditing ? 'editalertContainerModal' : 'alertContainerModal'}${Booking.id_booking}" class="mt-3 d-none">
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Perhatian!</strong> Ada field yang belum terisi:
                                <ul id="${isEditing ? 'editmissingFieldsListModal' : 'missingFieldsListModal'}${Booking.id_booking}" class="mb-0"></ul>
                            </div>
                        </div>
                        <div id="${isEditing ? 'editsuccessAlertContainerModal' : 'successAlertContainerModal'}${Booking.id_booking}" class="mt-3 d-none">
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                ${isEditing ? 'Berhasil Mengubah Data Booking!' : 'Berhasil Apply Booking!'}
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                        <form role="form" name="${isEditing ? 'editFormModal' : 'bookingFormModal'}" id="${isEditing ? 'editForm' : 'bookingForm'}${Booking.id_booking}" method="post">
                            <input type="hidden" id="${isEditing ? 'editIdModal' : 'idModal'}${Booking.id_booking}" value="${Booking.id_booking}" ${isEditing ? '' : 'disabled'}>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="${isEditing ? 'editNama' : 'nama'}">Nama</label>
                                    <input type="text" id="${isEditing ? 'editNamaModal' : 'namaModal'}${Booking.id_booking}" name="${isEditing ? 'editNama' : 'nama'}" autocomplete="off" class="form-control" ${isEditing ? `list="editdatalist_nama${Booking.id_booking}" onchange="editReverencePelanggan(${Booking.id_booking})"` : ''} required value="${Booking.nama_booking}" ${isEditing ? '' : 'disabled'}>
                                </div>
                                ${isEditing ? `<datalist id="editdatalist_nama${Booking.id_booking}"></datalist>` : ''}
                                <div class="form-group col-md-6">
                                    <label for="${isEditing ? 'editNomorHP' : 'telp'}">Nomor HP</label>
                                    <input type="text" name="${isEditing ? 'editNomorHP' : 'telp'}" id="${isEditing ? 'editNomorHPModal' : 'telpModal'}${Booking.id_booking}" class="form-control" required value="${Booking.nomerhp_booking}" ${isEditing ? '' : 'disabled'}>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="${isEditing ? 'editTanggal' : 'tanggal'}">Tanggal</label>
                                    <input type="date" id="${isEditing ? 'editTanggalModal' : 'tanggalModal'}${Booking.id_booking}" name="${isEditing ? 'editTanggal' : 'tanggal'}" required class="form-control" ${isEditing ? '' : 'readonly'} value="${Booking.tanggal_booking}">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="${isEditing ? 'editWaktu' : 'waktu'}">Waktu</label>
                                    ${isEditing ? `<input type="text" id="editWaktuModal${Booking.id_booking}" name="editWaktu" class="form-control" required value="${Booking.waktu_booking}">` : `
                                    <select id="waktuModal${Booking.id_booking}" name="waktu" required="required" class="form-control" disabled>
                                        <option selected>${Booking.waktu_booking}</option>
                                    </select>`}
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="${isEditing ? 'editPesan' : 'pesan'}">Pesan</label>
                                <input type="text" id="${isEditing ? 'editPesanModal' : 'pesanModal'}${Booking.id_booking}" name="${isEditing ? 'editPesan' : 'pesan'}" class="form-control" required value="${Booking.pesan_booking}" ${isEditing ? '' : 'disabled'}>
                            </div>
                            <div class="form-group service-data-container${Booking.id_booking}">
                        
                            </div>
                            <div id="total-hargas${Booking.id_booking}">
                                Total Harga: Rp. 0
                            </div>
                            <input type="hidden" id="hargas${Booking.id_booking}" name="hargas" value="${Booking.pesan_booking}">
                            <button id="${isEditing ? 'editSubmitBtnModal' : 'submitBtnModal'}${Booking.id_booking}" class="btn btn-primary btn-block fw-bold text-black fs-5" type="button">${submitBtnText}</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    modalElement.querySelector(`#${isEditing ? 'editSubmitBtnModal' : 'submitBtnModal'}${Booking.id_booking}`).addEventListener('click', function() {
        submitBooking(Booking.id_booking, isEditing);
    });

    modalElement.querySelector(`#${isEditing ? 'closeEditModal' : 'closeBookingModal'}${Booking.id_booking}`).addEventListener('click', function() {
        resetTable();
    });

    return modalElement;
}

function submitBooking(booId, isEdit) {
    var closeButtonId = isEdit ? `editModal${booId}` : `bookingModal${booId}`;
    var buttonId = isEdit ? `editSubmitBtnModal${booId}` : `submitBtnModal${booId}`;
    var idFieldId = isEdit ? `editIdModal${booId}` : `idModal${booId}`;
    var namaFieldId = isEdit ? `editNamaModal${booId}` : `namaModal${booId}`;
    var nomerhpFieldId = isEdit ? `editNomorHPModal${booId}` : `telpModal${booId}`;
    var tanggalFieldId = isEdit ? `editTanggalModal${booId}` : `tanggalModal${booId}`;
    var waktuFieldId = isEdit ? `editWaktuModal${booId}` : `waktuModal${booId}`;
    var pesanFieldId = isEdit ? `editPesanModal${booId}` : `pesanModal${booId}`;
    var missingFieldsListId = isEdit ? `editmissingFieldsListModal${booId}` : `missingFieldsListModal${booId}`;
    var alertContainerId = isEdit ? `editalertContainerModal${booId}` : `alertContainerModal${booId}`;
    var editsuccessAlertContainerId = isEdit ? `editsuccessAlertContainerModal${booId}` : `successAlertContainerModal${booId}`;

    var button = document.getElementById(buttonId);

    // Menonaktifkan tombol
    button.disabled = true;

    // Menunggu 5 detik sebelum mengaktifkan kembali tombol
    setTimeout(function() {
        button.disabled = false;
    }, 5000);

    var id = document.getElementById(idFieldId).value;
    var nama_booking = document.getElementById(namaFieldId).value;
    var nomerhp_booking = document.getElementById(nomerhpFieldId).value;
    var tanggal = document.getElementById(tanggalFieldId).value;
    var waktu = document.getElementById(waktuFieldId).value;
    var pesan = document.getElementById(pesanFieldId).value;
    var harga = document.getElementById(`hargas${booId}`).value;

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
        document.getElementById(missingFieldsListId).innerHTML = fieldsNotFilled.map(function(field) {
            return "<li>" + field + "</li>";
        }).join("");
        document.getElementById(alertContainerId).classList.remove("d-none");
        if (isEdit === true){
            setTimeout(function() {
                document.getElementById(alertContainerId).classList.add("d-none"); 
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
            document.getElementById(editsuccessAlertContainerId).classList.remove("d-none");
            setTimeout(function() {
                window.location.href = '?Booking';
                document.getElementById(editsuccessAlertContainerId).classList.add("d-none"); 
                document.getElementById(closeButtonId).getElementsByClassName("close")[0].click();
                
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

export { BookingModal };