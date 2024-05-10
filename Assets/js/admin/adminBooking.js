function ReverencePelanggan() {
    const url = 'http://localhost/BEPLAZA/API/api.php/User';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const PelangganContainer = document.querySelector('#datalist_nama');
        data.forEach(Pelanggan => {
            const PelangganOption = document.createElement('option');
            PelangganOption.value = Pelanggan.username;
            PelangganContainer.appendChild(PelangganOption);
        });
        // isi nomer telepon
        var namaInput = document.getElementsByName('nama')[0].value;
        var nomorInput = document.getElementById('telp');
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

function DataService() {
    const url = 'http://localhost/BEPLAZA/API/api.php/layanan';
    fetch(url)
    .then(response => response.json())
    .then(data => {
        const layananContainer = document.querySelector('.service-data');
        layananContainer.innerHTML = `
            <label>Service</label>
        `;

        data.forEach(Layanan => {
            if(Layanan.tampilkan === '1') {
            var formattedNumber = new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(Layanan.harga);
            const layananElement = document.createElement('div');
            layananElement.classList.add('form-check');
            layananElement.innerHTML = `
                <input class="form-check-input service-checkbox" type="checkbox" name="service[]" value="${Layanan.id_pelayanan}" id="${Layanan.id_pelayanan}" data-harga="${Layanan.harga}">
                <label class="form-check-label" for="service${Layanan.id_pelayanan}">${Layanan.nama} = Rp. ${formattedNumber} </label>
            `;
            layananContainer.appendChild(layananElement);
            }
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });

}

ReverencePelanggan()
DataService()

function formatRupiah(angka) {
    var reverse = angka.toString().split('').reverse().join(''),
        ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');
    return ribuan;
}



setInterval(doSomethingWithCheckboxes, 1000);
var totalHarga = 0; 
function doSomethingWithCheckboxes() {
    var checkboxes = document.querySelectorAll('.service-checkbox');
    checkboxes.forEach(function(checkbox) {
        checkbox.addEventListener('change', function() {
            totalHarga = 0;
            checkboxes.forEach(function(cb) {
                if (cb.checked) {
                    totalHarga += parseFloat(cb.getAttribute('data-harga'));
                }
            });
            var formattedHarga = 'Rp. ' + formatRupiah(totalHarga.toFixed(0));
            document.getElementById('total-harga').textContent = 'Total Harga: ' + formattedHarga;
            

        });
    });
    let hargaElement = document.getElementById('harga');
    if (hargaElement) {
        hargaElement.value = totalHarga;
    } else {
        let hargaContainer = document.querySelector('#total-harga');
        let hargaElementBaru = document.createElement('input');
        hargaElementBaru.setAttribute('type', 'hidden');
        hargaElementBaru.setAttribute('id', 'harga');
        hargaElementBaru.setAttribute('name', 'harga');
        hargaElementBaru.value = totalHarga;
        hargaContainer.appendChild(hargaElementBaru);
    }

}

function setMinDate() {
    var inputTanggal = document.getElementById('tanggal');
    if (inputTanggal) {
        
        var Hours = new Date();
        Hours.setHours(Hours.getHours() + 7);
        var today = Hours.toISOString().split('T')[0];
        inputTanggal.min = today;
    } else {
        setTimeout(setMinDate, 1000);
    }
}

setMinDate();

function fetchGetBookedTimes(tanggal) {
    const tanggalFormatted = tanggal.split('-').join('');
    const url = `http://localhost/BEPLAZA/API/api.php/booking/${tanggalFormatted}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayBookedTimes(data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayBookedTimes(bookedTimes) {
    // Data waktu yang tersedia
    const availableTimes = WatchData.filter(time => !bookedTimes.includes(time));

    // Menyimpan waktu yang tersedia ke dalam elemen select
    var waktuSelect = document.getElementById("waktu");
    waktuSelect.disabled = false;
    waktuSelect.innerHTML = "";

    availableTimes.forEach(function(waktu) {
        // Menghapus detik dari waktu
        var displayTime = waktu.slice(0);
        
        var option = document.createElement("option");
        option.text = displayTime;
        option.value = waktu;
        waktuSelect.add(option);
    });
}

function enableWaktu() {
    var tanggalInput = document.getElementById("tanggal");
    var tanggal = tanggalInput.value;

    if (tanggal) {
        fetchGetBookedTimes(tanggal);
    } else {
        var waktuSelect = document.getElementById("waktu");
        waktuSelect.disabled = true;
        waktuSelect.innerHTML = "";
    }
}

// Panggil fungsi untuk mengambil data booking dari API pertama kali
fetchGetDataBooking();

function resetTable() {
    currentPageTable1 = 1; // Variabel untuk melacak halaman saat ini untuk tabel pertama
    currentPageTable2 = 1;
    fetchGetDataBooking();
}

let currentPageTable1 = 1; // Variabel untuk melacak halaman saat ini untuk tabel pertama
let currentPageTable2 = 1; // Variabel untuk melacak halaman saat ini untuk tabel kedua
const itemsPerPage = 5; // Jumlah item per halaman
let BookingData; // Variabel untuk menyimpan data booking

// Fungsi untuk mengambil data Booking dari API
function fetchGetDataBooking() {
    const url = 'http://localhost/BEPLAZA/API/api.php/booking';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        // Simpan data booking yang diterima dari API
        BookingData = data;

        // Panggil fungsi pertama kali untuk menampilkan data awal untuk masing-masing tabel
        displayBookingTable1(0);
        displayBookingTable2(0);
    })
    .catch(error => {
        // Handle error
        console.error('Error:', error);
    });
}

// Fungsi untuk menampilkan data berikutnya dari tabel pertama
function nextPageTable1() {
    const startIndex = currentPageTable1 * itemsPerPage;
    currentPageTable1++;
    displayBookingTable1(startIndex);
}

// Fungsi untuk menampilkan data berikutnya dari tabel kedua
function nextPageTable2() {
    const startIndex = currentPageTable2 * itemsPerPage;
    currentPageTable2++;
    displayBookingTable2(startIndex);
}

// Fungsi untuk menampilkan data sebelumnya dari tabel pertama
function prevPageTable1() {
    currentPageTable1--;
    const startIndex = (currentPageTable1 - 1) * itemsPerPage;
    displayBookingTable1(startIndex);
}

// Fungsi untuk menampilkan data sebelumnya dari tabel kedua
function prevPageTable2() {
    currentPageTable2--;
    const startIndex = (currentPageTable2 - 1) * itemsPerPage;
    displayBookingTable2(startIndex);
}
// Fungsi untuk menampilkan data pada halaman tertentu untuk tabel pertama
function displayBookingTable1(startIndex) {
    const BookingContainer = document.querySelector('.tbody-dataBo');
    // Membersihkan tabel sebelum menambahkan data baru
    BookingContainer.innerHTML = '';

    // Menampilkan data yang memenuhi kondisi sesuai halaman dan indeks awal
    let iterasi = 1;
    let displayedCount = 0;
    for (let i = 0; i < BookingData.length; i++) {
        const Booking = BookingData[i];
        if (!Booking.order_layanan && !Booking.harga_booking) {
            if (displayedCount >= startIndex && displayedCount < startIndex + itemsPerPage) {
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

                // Tambahkan elemen modal untuk setiap data booking
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
                                    <form role="form" name="bookingFormModal" id="bookingForm" method="post">
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
                                        <button id="submitBtnModal${Booking.id_booking}" class="btn btn-primary btn-block fw-bold text-black fs-5" type="button" onclick="submitBookingAdmModal(${Booking.id_booking})">Simpan</button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                document.body.appendChild(modalElement);
                // Menambahkan kode untuk menampilkan data checkbox
                const url = 'http://localhost/BEPLAZA/API/api.php/layanan';
                fetch(url)
                    .then(response => response.json())
                    .then(data => {
                        const layananContainer = document.querySelector(`.service-data-container${Booking.id_booking}`);
                        layananContainer.innerHTML = `<label>Service</label>`;

                        data.forEach(Layanan => {
                            if(Layanan.tampilkan === '1') {
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

                        var booId = Booking.id_booking;
                        var totalHarga = {};
                        totalHarga[booId] = 0;

                        // Pindahkan kode untuk menambahkan event listener ke sini
                        var checkboxes = document.querySelectorAll(`.service-checkboxs${Booking.id_booking}`);
                        checkboxes.forEach(function(checkbox) {
                            checkbox.addEventListener('change', function() {
                                totalHarga[booId] = 0;
                                checkboxes.forEach(function(cb) {
                                    if (cb.checked) {
                                        totalHarga[booId] += parseFloat(cb.getAttribute('data-hargas'));
                                    }
                                });
                                var formattedHarga = 'Rp. ' + formatRupiah(totalHarga[booId].toFixed(0));
                                document.getElementById(`total-hargas${Booking.id_booking}`).textContent = 'Total Harga: ' + formattedHarga;
                                document.getElementById(`hargas${Booking.id_booking}`).value = totalHarga[booId];
                            });
                        });
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });

                }
            displayedCount++;
        }
    }

    // Mengecek apakah masih ada data setelah halaman terakhir
    const hasNextPage = startIndex + itemsPerPage < displayedCount;
    // Men-disable tombol "Next" jika tidak ada data lagi
    document.getElementById('nextBtnTable1').disabled = !hasNextPage;
    // Men-disable tombol "Previous" jika halaman pertama sudah tercapai
    document.getElementById('prevBtnTable1').disabled = startIndex === 0;

    // Menampilkan informasi jumlah halaman
    const totalPages = Math.ceil(displayedCount / itemsPerPage);
    document.getElementById('pageInfoTable1').innerText = `Page ${currentPageTable1} / ${totalPages}`;

    
}


// Fungsi untuk menampilkan data pada halaman tertentu untuk tabel kedua
function displayBookingTable2(startIndex) {
    const BookingACC = document.querySelector('.BoSudahACC');
    // Membersihkan tabel sebelum menambahkan data baru
    BookingACC.innerHTML = '';

    // Menampilkan data yang memenuhi kondisi sesuai halaman dan indeks awal
    let iterasiACC = 1;
    let displayedCount = 0;
    for (let i = 0; i < BookingData.length; i++) {
        const Booking = BookingData[i];
        if (Booking.order_layanan) {
            if (displayedCount >= startIndex && displayedCount < startIndex + itemsPerPage) {
                const BookingElementACC = document.createElement('tr');
                BookingElementACC.innerHTML = `
                    <td>${startIndex + iterasiACC}</td>
                    <td>${Booking.nama_booking}</td>
                    <td>${Booking.nomerhp_booking}</td>
                    <td>${Booking.order_layanan}</td>
                    <td>${Booking.waktu_booking}</td>
                    <td>${Booking.tanggal_booking}</td>
                    <td>${Booking.pesan_booking}</td>
                    <td>${Booking.harga_booking}</td>
                    <td class="row">
                        <button class="btn-warning rounded mb-1 text-white" data-toggle="modal" data-target="#editModal${Booking.id_booking}">Edit</button>
                        <button id="btn_delete${Booking.id_booking}" class="btn-danger rounded " onclick="deleteBooking(${Booking.id_booking})">Hapus</button>
                    </td>
                `;
                BookingACC.appendChild(BookingElementACC);
                iterasiACC++;

                // Tambahkan elemen modal untuk setiap data booking
                const modalElement = createModalElement(Booking);
                document.body.appendChild(modalElement);
                fetchAndDisplayServices(Booking);
            }
            displayedCount++;
        }
    }

    // Mengecek apakah masih ada data setelah halaman terakhir
    const hasNextPage = startIndex + itemsPerPage < displayedCount;
    // Men-disable tombol "Next" jika tidak ada data lagi
    document.getElementById('nextBtnTable2').disabled = !hasNextPage;
    // Men-disable tombol "Previous" jika halaman pertama sudah tercapai
    document.getElementById('prevBtnTable2').disabled = startIndex === 0;

    // Menampilkan informasi jumlah halaman
    const totalPages = Math.ceil(displayedCount / itemsPerPage);
    document.getElementById('pageInfoTable2').innerText = `Page ${currentPageTable2} / ${totalPages}`;
}

// Fungsi untuk membuat elemen modal
function createModalElement(Booking) {
    const modalElement = document.createElement('div');
    editReverencePelanggan(Booking.id_booking)
    modalElement.innerHTML = `
        <div class="modal fade" id="editModal${Booking.id_booking}" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Edit Booking</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close" onclick="resetTable()">
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
                            <input type="hidden" id="hargas${Booking.id_booking}" name="hargas" value="0">
                            <button id="editSubmitBtnModal${Booking.id_booking}" class="btn btn-primary btn-block fw-bold text-black fs-5" type="button" onclick="submitEditBooking(${Booking.id_booking})">Simpan Perubahan</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    `;
    return modalElement;
}

// Fungsi untuk mengambil dan menampilkan layanan pada modal
function fetchAndDisplayServices(Booking) {
    const url = 'http://localhost/BEPLAZA/API/api.php/layanan';
    const orderUrl = `http://localhost/BEPLAZA/API/api.php/BookingOrder/${Booking.id_booking}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const layananContainer = document.querySelector(`.service-data-container${Booking.id_booking}`);
            layananContainer.innerHTML = `<label>Service</label>`;

            data.forEach(Layanan => {
                if(Layanan.tampilkan === '1') {
                var formattedNumber = new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(Layanan.harga);
                const layananElement = document.createElement('div');
                layananElement.classList.add('form-check');
                layananElement.innerHTML = `
                    <input class="form-check-input service-checkboxs${Booking.id_booking}" type="checkbox" name="services${Booking.id_booking}[]" value="${Layanan.id_pelayanan}" id="${Layanan.id_pelayanan}" data-hargas="${Layanan.harga}">
                    <label class="form-check-label" for="service${Layanan.id_pelayanan}">${Layanan.nama} = Rp. ${formattedNumber} </label>
                `;
                layananContainer.appendChild(layananElement);
                }
                else {
                    var formattedNumber = new Intl.NumberFormat('id-ID', { style: 'decimal', minimumFractionDigits: 0 }).format(Layanan.harga);
                    const layananElement = document.createElement('div');
                    layananElement.classList.add('form-check');
                    layananElement.innerHTML = `
                        <input class="form-check-input service-checkboxs${Booking.id_booking}" type="checkbox" name="services${Booking.id_booking}[]" value="${Layanan.id_pelayanan}" id="${Layanan.id_pelayanan}" data-hargas="${Layanan.harga}">
                        <label class="form-check-label" for="service${Layanan.id_pelayanan}">${Layanan.nama} = Rp. ${formattedNumber} <span class="text-danger">[ Tidak Di tampilkan ]</span></label>
                    `;
                    layananContainer.appendChild(layananElement);
                }
            });

            var booId = Booking.id_booking;
            var totalHarga = {};
            totalHarga[booId] = 0;

            fetch(orderUrl)
            .then(response => response.json())
            .then(orderData => {
                // console.log('Data dari API BookingOrder:', orderData);
                const checkedServiceIds = orderData.map(order => order.id_pelayanan);
                const checkboxes = document.querySelectorAll(`.service-checkboxs${Booking.id_booking}`);

                checkboxes.forEach(checkbox => {
                    const serviceId = parseInt(checkbox.value);
                    checkedServiceIds.forEach(idorder => {
                        if(idorder==serviceId){
                            checkbox.checked = true;
                            updateTotalHarga(checkboxes);
                        }
                    })
                });

                function updateTotalHarga(checkboxes) {
                    totalHarga[booId] = 0;
                    checkboxes.forEach(function(cb) {
                        if (cb.checked) {
                            totalHarga[booId] += parseFloat(cb.getAttribute('data-hargas'));
                        }
                    });
                    var formattedHarga = 'Rp. ' + formatRupiah(totalHarga[booId].toFixed(0));
                    document.getElementById(`total-hargas${Booking.id_booking}`).textContent = 'Total Harga: ' + formattedHarga;
                    document.getElementById(`hargas${Booking.id_booking}`).value = totalHarga[booId];
                }

                // Tambahkan event listener setelah menandai checkbox yang sesuai
                checkboxes.forEach(function(checkbox) {
                    checkbox.addEventListener('change', function() {
                        updateTotalHarga(checkboxes);
                    });
                });
            })
            .catch(error => {
                console.error('Error:', error);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function resetForm() {
    document.getElementById("nama").value = "";
    document.getElementById("telp").value = "";
    document.getElementById("tanggal").value = "";
    document.getElementById("harga").value = "0";
    document.getElementById("waktu").value = "";
    document.getElementById("pesan").value = "";
    document.getElementById('total-harga').textContent = 'Total Harga: Rp. 0';
    var checkboxes = document.getElementsByName("service[]");
    for (var i = 0; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
}

function submitBookingAdm() {
    var button = document.getElementById("submitBtn");

    // Menonaktifkan tombol
    button.disabled = true;

    // Menunggu 5 detik sebelum mengaktifkan kembali tombol
    setTimeout(function() {
        button.disabled = false;
    }, 5000);

    var nama_booking = document.getElementById("nama").value;
    var nomerhp_booking = document.getElementById("telp").value;
    var tanggal = document.getElementById("tanggal").value;
    var waktu = document.getElementById("waktu").value;
    var pesan = document.getElementById("pesan").value;
    var harga = document.getElementById("harga").value;


    var checkboxes = document.getElementsByName("service[]");
    
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
    if (harga < 1 || countSelectedServices < 1 ) {
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
        document.getElementById("missingFieldsList").innerHTML = fieldsNotFilled.map(function(field) {
            return "<li>" + field + "</li>";
        }).join("");
        document.getElementById("alertContainer").classList.remove("d-none");
        setTimeout(function() {
            document.getElementById("missingFieldsList").innerHTML = "";
            document.getElementById("alertContainer").classList.add("d-none");
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
    console.log(selectedServices)
    var jsonData = JSON.stringify(dataToSend);

    var xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost/BEPLAZA/API/api.php/booking-admin", true); // Mengubah URL ke endpoint order

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById("successAlertContainer").classList.remove("d-none");
            resetTable();
            resetForm();
            harga=0;
            countSelectedServices=0;
            setTimeout(function() {
                document.getElementById(`successAlertContainer`).classList.add("d-none"); // Menambahkan kembali class d-none setelah alert ditampilkan
            }, 5000); 
        } else {
            console.error("Gagal menambahkan booking:", xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error("Koneksi error.");
    };

    xhr.send(jsonData);
}

function submitBookingAdmModal(booId) {
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


function deleteBooking(booId) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        var button = document.getElementById(`btn_delete${booId}`);

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
