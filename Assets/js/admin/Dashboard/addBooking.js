import { enableWaktu, setMinDate } from "./utils.js";
import { fetchAndDisplayServices } from "./bookingAll.js"
import { SubmitButton } from "./bookingAll.js"

const createBookingForm = async (Action) => {
    // Mendapatkan elemen tempat Anda ingin menambahkan formulir
    var formContainer = document.getElementById('formContainer');
    const BookingID = 1;
    const closeModalId = `CloseModal${Action}${BookingID}`;
    const alertContainerId = `AlertContainer${Action}${BookingID}`;
    const missingFieldsListId = `MissingFieldsList${Action}${BookingID}`;
    const successAlertContainerId = `SuccessAlertContainer${Action}${BookingID}`;
    const formId = `Form${Action}${BookingID}`;
    const idFieldId = `Id${Action}${BookingID}`;
    const namaFieldId = `Nama${Action}${BookingID}`;
    const nomorHPFieldId = `NomorHP${Action}${BookingID}`;
    const tanggalFieldId = `Tanggal${Action}${BookingID}`;
    const waktuFieldId = `Waktu${Action}${BookingID}`;
    const pesanFieldId = `Pesan${Action}${BookingID}`;
    const submitBtnId = `SubmitBtn${Action}${BookingID}`;
    const TotalHarga = `TotalHarga${Action}${BookingID}`;
    const Harga = `Harga${Action}${BookingID}`;

    // Menyiapkan HTML untuk formulir
    var formHTML = `
        <div id="${alertContainerId}" class="mt-3 d-none">
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>Perhatian!</strong> Ada field yang belum terisi:
                <ul id="${missingFieldsListId}" class="mb-0"></ul>
                <button type="button" class="close" data-dismiss="alert" aria-label="Close" id="${closeModalId}">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        </div>
        <div id="${successAlertContainerId}" class="mt-3 d-none">
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                Booking berhasil ditambahkan! 
            </div>
        </div>
        <form role="form" name="${formId}" id="${formId}" method="post" class="booking-form">
            <div class="section section-1">
                <div class="form-group">
                    <label for="nama_booking">Nama</label>
                    <input type="text" id="${namaFieldId}" name="${namaFieldId}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="tanggal">Tanggal</label>
                    <input type="date" id="${tanggalFieldId}" name="${tanggalFieldId}" required="required" class="form-control" data-validation-required-message="Silahkan masukan tanggal booking" required>
                </div>
            </div>
            <div class="section section-2">
                <div class="form-group">
                    <label for="nomerhp_booking">Nomor Ponsel</label>
                    <input type="text" name="${nomorHPFieldId}" id="${nomorHPFieldId}" class="form-control" required>
                </div>
                <div class="form-group">
                    <label for="waktu">Waktu</label>
                    <select id="${waktuFieldId}" name="${waktuFieldId}" required="required" class="form-control" disabled>
                        <option value="" disabled selected>Pilih Tanggal Dahulu</option>
                    </select>
                </div>
            </div>
            <div class="section section-3">
                <div class="form-group service-data-container${BookingID}"></div>
            </div>
            <div class="section section-4">
                <div class="form-group">
                    <label for="pesan">Pesan</label>
                    <textarea type="text" id="${pesanFieldId}" name="${pesanFieldId}" class="form-control" required></textarea>
                </div>
            </div>
            <div class="section section-5">
                <div id="${TotalHarga}">
                    Total Harga: Rp. 0
                </div>
            </div>
            <div class="section section-6">
                <div class="form-group">
                    <div class="form-group service-data "></div>
                    <button id="${submitBtnId}" class="btn btn-primary btn-block fw-bold text-black fs-5" type="button">Tambah Booking</button>
                </div>
            </div>
        </form>
    `;
    formContainer.innerHTML = formHTML;

    await fetchAndDisplayServices(BookingID, Action); // Menunggu fetchAndDisplayServices selesai
    setMinDate(tanggalFieldId);

    var tanggalInput = document.getElementById(tanggalFieldId);
    tanggalInput.addEventListener("change", function() {
        enableWaktu(tanggalFieldId, waktuFieldId, Action);
    });

    var submitbutton = formContainer.querySelector(`#${submitBtnId}`);
    submitbutton.addEventListener('click', function() {
        SubmitButton(BookingID, Action);
    });
}

export { createBookingForm };