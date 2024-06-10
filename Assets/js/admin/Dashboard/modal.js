import { resetTable } from './DashboardAdmin.js';
import { SubmitButton } from './BookingAll.js'
import { enableWaktu } from "./utils.js";

function HistoryAndEditingModal(Booking, Action) {
    const modalElement = document.createElement('div');

    const BookingID = Booking.id_booking;

    const modalId = `Modal${Action}${BookingID}`;
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
                                    ${Action === 'edit' ?
                                        `<select id="${waktuFieldId}" name="${waktuFieldId}" required="required" class="form-control">
                                            <option value="${Booking.waktu_booking}" selected>${Booking.waktu_booking}</option>
                                        </select>` :
                                        `<select id="${waktuFieldId}" name="${waktuFieldId}" required="required" class="form-control" readonly>
                                            <option value="${Booking.waktu_booking}" selected>${Booking.waktu_booking}</option>
                                        </select>`
                                    }
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
    
    modalElement.querySelector(`#${tanggalFieldId}`).addEventListener('change', function() {
        enableWaktu(tanggalFieldId, waktuFieldId);
    });

    return modalElement;
}

function getBookingData(BookingID, Action) {
    const nama = document.getElementById(`Nama${Action}${BookingID}`).value;
    const nomorHP = document.getElementById(`NomorHP${Action}${BookingID}`).value;
    const tanggal = document.getElementById(`Tanggal${Action}${BookingID}`).value;
    const waktu = document.getElementById(`Waktu${Action}${BookingID}`).value;
    const pesan = document.getElementById(`Pesan${Action}${BookingID}`).value;
    enableWaktu(`Tanggal${Action}${BookingID}`, `Waktu${Action}${BookingID}`);

    return {
        nama: nama,
        nomorHP: nomorHP,
        tanggal: tanggal,
        waktu: waktu,
        pesan: pesan
    };
}

export { HistoryAndEditingModal, getBookingData };