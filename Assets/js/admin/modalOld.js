function ApplyBookingListModal(Booking) {
    const modalElement = document.createElement('div');
    modalElement.innerHTML = `
        <div class="modal fade" id="bookingModal${Booking.id_booking}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Booking Details</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="alertContainerModal${Booking.id_booking}" class="mt-3 d-none">
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Perhatian!</strong> Ada field yang belum terisi:
                                <ul id="missingFieldsListModal${Booking.id_booking}" class="mb-0"></ul>
                            </div>
                        </div>
                        <div id="successAlertContainerModal${Booking.id_booking}" class="mt-3 d-none">
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                Berhasil Apply Booking! 
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                        <form role="form" name="bookingFormModal" id="bookingForm${Booking.id_booking}" method="post">
                            <input type="hidden" id="idModal${Booking.id_booking}" value="${Booking.id_booking}" disabled>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="nama">Nama</label>
                                    <input type="text" id="namaModal${Booking.id_booking}" name="nama" class="form-control" required value="${Booking.nama_booking}" disabled>
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="telp">Nomer Hp</label>
                                    <input type="text" name="telp" id="telpModal${Booking.id_booking}" class="form-control" required value="${Booking.nomerhp_booking}" disabled>
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="tanggal">Tanggal</label>
                                    <input type="date" id="tanggalModal${Booking.id_booking}" name="tanggal" required="required" class="form-control" data-validation-required-message="Silahkan masukan tanggal booking" readonly value="${Booking.tanggal_booking}">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="waktu">Waktu</label>
                                    <select id="waktuModal${Booking.id_booking}" name="waktu" required="required" class="form-control" disabled>
                                        <option selected>${Booking.waktu_booking}</option>
                                    </select>
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Pesan</label>
                                <input type="text" id="pesanModal${Booking.id_booking}" name="pesan" class="form-control" required value="${Booking.pesan_booking}">
                            </div>
                            <div class="form-group service-data-container${Booking.id_booking}">

                            </div>
                            <div id="total-hargas${Booking.id_booking}">
                                Total Harga: Rp. 0
                            </div>
                            <input type="hidden" id="hargas${Booking.id_booking}" name="hargas" value="0">
                            <button id="submitBtnModal${Booking.id_booking}" class="btn btn-primary btn-block fw-bold text-black fs-5" type="button">Simpan</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Tambahkan event listener untuk menangani klik tombol Simpan
    modalElement.querySelector(`#submitBtnModal${Booking.id_booking}`).addEventListener('click', function() {
        submitBooking(Booking.id_booking, false);
    });

    return modalElement;
}

// Berfungsi ketika mengubah suatu data riwayat (Berhasil)
function EditHistoryBookingModal(Booking) {
    const modalElement = document.createElement('div');
    editReverencePelanggan(Booking.id_booking)
    modalElement.innerHTML = `
        <div class="modal fade" id="editModal${Booking.id_booking}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit Booking</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" id="closeEditModal${Booking.id_booking}">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div id="editalertContainerModal${Booking.id_booking}" class="mt-3 d-none">
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Perhatian!</strong> Ada field yang belum terisi:
                                <ul id="editmissingFieldsListModal${Booking.id_booking}" class="mb-0"></ul>
                            </div>
                        </div>
                        <div id="editsuccessAlertContainerModal${Booking.id_booking}" class="mt-3 d-none">
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                Berhasil Mengubah Data Booking! 
                                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                        </div>
                        <form role="form" name="editFormModal" id="editForm${Booking.id_booking}" method="post">
                            <input type="hidden" id="editIdModal${Booking.id_booking}" value="${Booking.id_booking}">
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="editNama">Nama</label>
                                    <input type="text" id="editNamaModal${Booking.id_booking}" name="editNama${Booking.id_booking}" autocomplete="off" class="form-control" list="editdatalist_nama${Booking.id_booking}" onchange="editReverencePelanggan(${Booking.id_booking})" required value="${Booking.nama_booking}">
                                </div>
                                <datalist id="editdatalist_nama${Booking.id_booking}">
                                </datalist>
                                <div class="form-group col-md-6">
                                    <label for="editNomorHP">Nomor HP</label>
                                    <input type="text" name="editNomorHPModal${Booking.id_booking}" id="editNomorHPModal${Booking.id_booking}" class="form-control" required value="${Booking.nomerhp_booking}">
                                </div>
                            </div>
                            <div class="form-row">
                                <div class="form-group col-md-6">
                                    <label for="editTanggal">Tanggal</label>
                                    <input type="date" id="editTanggalModal${Booking.id_booking}" name="editTanggal" required class="form-control" value="${Booking.tanggal_booking}">
                                </div>
                                <div class="form-group col-md-6">
                                    <label for="editWaktu">Waktu</label>
                                    <input type="text" id="editWaktuModal${Booking.id_booking}" name="editWaktu" class="form-control" required value="${Booking.waktu_booking}">
                                </div>
                            </div>
                            <div class="form-group">
                                <label for="editPesan">Pesan</label>
                                <input type="text" id="editPesanModal${Booking.id_booking}" name="editPesan" class="form-control" required value="${Booking.pesan_booking}">
                            </div>
                            <div class="form-group service-data-container${Booking.id_booking}">
                        
                            </div>
                            <div id="total-hargas${Booking.id_booking}">
                                Total Harga: Rp. 0
                            </div>
                            <input type="hidden" id="hargas${Booking.id_booking}" name="hargas" value="${Booking.pesan_booking}">
                            <button id="editSubmitBtnModal${Booking.id_booking}" class="btn btn-primary btn-block fw-bold text-black fs-5" type="button">Simpan Perubahan</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;

    modalElement.querySelector(`#editSubmitBtnModal${Booking.id_booking}`).addEventListener('click', function() {
        submitBooking(Booking.id_booking, true);
    });

    modalElement.querySelector(`#closeEditModal${Booking.id_booking}`).addEventListener('click', function() {
        resetTable();
    });

    return modalElement;
}

// (Berhasil)
function SubmitButtonApplyBooking(booId) {
    var button = document.getElementById(`submitBtnModal${booId}`);

    // Menonaktifkan tombol
    button.disabled = true;

    // Menunggu 5 detik sebelum mengaktifkan kembali tombol
    setTimeout(function() {
        button.disabled = false;
    }, 5000);

    var id = document.getElementById(`idModal${booId}`).value;
    var nama_booking = document.getElementById(`namaModal${booId}`).value;
    var nomerhp_booking = document.getElementById(`telpModal${booId}`).value;
    var tanggal = document.getElementById(`tanggalModal${booId}`).value;
    var waktu = document.getElementById(`waktuModal${booId}`).value;
    var pesan = document.getElementById(`pesanModal${booId}`).value;
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
        document.getElementById(`missingFieldsListModal${booId}`).innerHTML = fieldsNotFilled.map(function(field) {
            return "<li>" + field + "</li>";
        }).join("");
        document.getElementById(`alertContainerModal${booId}`).classList.remove("d-none");
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
            document.getElementById(`successAlertContainerModal${booId}`).classList.remove("d-none");
            setTimeout(function() {
                window.location.href = '?Booking';
                document.getElementById(`successAlertContainerModal${booId}`).classList.add("d-none"); 
                document.getElementById(`bookingModal${booId}`).getElementsByClassName("close")[0].click();
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

function submitEditBooking(booId) {
    var button = document.getElementById(`editSubmitBtnModal${booId}`);

    // Menonaktifkan tombol
    button.disabled = true;

    // Menunggu 5 detik sebelum mengaktifkan kembali tombol
    setTimeout(function() {
        button.disabled = false;
    }, 5000);

    var id = document.getElementById(`editIdModal${booId}`).value;
    var nama_booking = document.getElementById(`editNamaModal${booId}`).value;
    var nomerhp_booking = document.getElementById(`editNomorHPModal${booId}`).value;
    var tanggal = document.getElementById(`editTanggalModal${booId}`).value;
    var waktu = document.getElementById(`editWaktuModal${booId}`).value;
    var pesan = document.getElementById(`editPesanModal${booId}`).value;
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
        document.getElementById(`editmissingFieldsListModal${booId}`).innerHTML = fieldsNotFilled.map(function(field) {
            return "<li>" + field + "</li>";
        }).join("");
        document.getElementById(`editalertContainerModal${booId}`).classList.remove("d-none");
        setTimeout(function() {
            document.getElementById(`editalertContainerModal${booId}`).classList.add("d-none"); 
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

    xhr.open("PUT", "http://localhost/BEPLAZA/API/api.php/bookingUpdate/"+id, true); // Mengubah URL ke endpoint order

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById(`editsuccessAlertContainerModal${booId}`).classList.remove("d-none");
            setTimeout(function() {
                resetTable();
                document.getElementById(`editsuccessAlertContainerModal${booId}`).classList.add("d-none"); 
                document.getElementById(`editModal${booId}`).getElementsByClassName("close")[0].click();
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