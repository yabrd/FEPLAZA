import { IsImage, CloseModal } from "./utils.js";

function AddServiceModal() {
    console.log('Panggil')
    const modalWrapper = document.createElement('div');
    modalWrapper.innerHTML += `
        <!-- Modal Tambah Pelayanan -->
        <div class="modal fade" id="tambahPelayananModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="tambahPelayananModalLabel">Tambah Pelayanan Baru</h5>
                        <button id="CloseButton" type="button" class="btn-close" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="alertContainer" class="mt-3 d-none">
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Perhatian!</strong> Ada field yang belum terisi:
                                <ul id="missingFieldsList" class="mb-0"></ul>
                            </div>
                        </div>
                        <div id="successAlertContainer" class="mt-3 d-none">
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                Layanan berhasil ditambahkan! 
                            </div>
                        </div>
                    <!-- Formulir untuk menambah pelayanan baru -->
                        <form id="formTambahPelayanan" onsubmit="return false;">
                            <div class="mb-3">
                                <label for="namaPelayanan" class="form-label">Nama Pelayanan</label>
                                <input type="text" class="form-control" id="namaPelayanan">
                            </div>
                            <div class="mb-3">
                                <label for="keteranganPelayanan" class="form-label">Keterangan</label>
                                <textarea class="form-control" id="keteranganPelayanan" rows="2"></textarea>
                            </div>
                            <div class="mb-3">
                                <label for="langsungTampilkan" class="form-label">Langsung Tampilkan</label>
                                <select name="langsungTampilkan" class="form-control" id="langsungTampilkan">
                                    <option value="1">Tampilkan</option>
                                    <option value="0">Sembunyikan</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="hargaPelayanan" class="form-label">Harga</label>
                                <input type="number" class="form-control" id="hargaPelayanan" min="0" value="0" required>
                            </div>
                            <div class="mb-3">
                                <label for="gambarPelayanan" class="form-label">Gambar</label>
                                <input type="file" class="form-control" id="gambarPelayanan">
                            </div>
                            <div id="previewContainer" class="mb-3">
                                <!-- Container untuk menampilkan gambar yang dipilih -->
                            </div>
                            <button id="simpanPelayanan" class="btn btn-primary">Simpan</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    `;

    modalWrapper.querySelector(`#CloseButton`).addEventListener('click', function() {
        CloseModal('tambahPelayananModal');
    });

    modalWrapper.querySelector('#gambarPelayanan').addEventListener('click', function() {
        previewImage(this);
    });
    
    modalWrapper.querySelector('#simpanPelayanan').addEventListener('click', function() {
        simpanDataPelayanan();
    });    

    return modalWrapper;
}


function previewImage(input) {
    var previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = ''; // Kosongkan container sebelum menambah gambar baru

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var imgElement = document.createElement('img');
            imgElement.setAttribute('src', e.target.result);
            imgElement.setAttribute('class', 'img-thumbnail mt-2 rounded');
            previewContainer.appendChild(imgElement);
        }

        reader.readAsDataURL(input.files[0]); // Baca data gambar sebagai URL
    }
}

function simpanDataPelayanan() {
    var button = document.getElementById("simpanPelayanan");
    button.disabled = true;
    setTimeout(function() {
        button.disabled = false;
    }, 5000);

    var namaPelayanan = document.getElementById("namaPelayanan").value;
    var keteranganPelayanan = document.getElementById("keteranganPelayanan").value;
    var tampilkanPelayanan = document.getElementById("langsungTampilkan").value;
    var hargaPelayanan = document.getElementById("hargaPelayanan").value;
    var gambarPelayanan = document.getElementById("gambarPelayanan").files[0];

    var fieldsNotFilled = [];

    if (namaPelayanan === "") {
        fieldsNotFilled.push("Nama");
    } else if (/[\[\]\{\}]/.test(namaPelayanan)) {
        fieldsNotFilled.push("Nama tidak boleh mengandung karakter khusus");
    }
    
    if (keteranganPelayanan === "") {
        fieldsNotFilled.push("Keterangan");
    } else if (/[\[\]\{\}]/.test(keteranganPelayanan)) {
        fieldsNotFilled.push("Keterangan tidak boleh mengandung karakter khusus");
    }
    
    if (hargaPelayanan === "") {
        fieldsNotFilled.push("Harga");
    } else if (isNaN(hargaPelayanan)) {
        fieldsNotFilled.push("Harga harus berupa angka");
    }    
    
    if (!gambarPelayanan) {
        fieldsNotFilled.push("Gambar");
    } else if (!IsImage(gambarPelayanan.name)) {
        fieldsNotFilled.push("Gambar harus berupa file gambar (format: .jpg, .jpeg, .png)");
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
        "nama": namaPelayanan,
        "keterangan": keteranganPelayanan,
        "harga": hargaPelayanan,
        "tampilkan": tampilkanPelayanan
    };


    var jsonData = JSON.stringify(dataToSend);

    var xhr = new XMLHttpRequest();

    xhr.open("POST", "http://localhost/BEPLAZA/API/api.php/layanan", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.status === 200) {
            simpanDataGambar()
        } else {
            console.error("Gagal menambahkan layanan:", xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error("Koneksi error.");
    };

    xhr.send(jsonData);
}

function simpanDataGambar() {
    var gambarPelayanan = document.getElementById("gambarPelayanan").files[0];

    var formData = new FormData();
    formData.append("gambar", gambarPelayanan);


    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost/BEPLAZA/API/api.php/gambarlayanan", true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById("successAlertContainer").classList.remove("d-none");
            setTimeout(function() {
                CloseModal('tambahPelayananModal')
                resetForm()
                document.getElementById(`successAlertContainer`).classList.add("d-none"); 
            }, 3000); 
            console.log(xhr.statusText)
        } else {
            console.error("Gagal menambahkan layanan:", xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error("Koneksi error.");
    };

    xhr.send(formData);
}

function resetForm() {
    document.getElementById("namaPelayanan").value = "";
    document.getElementById("hargaPelayanan").value = "0";
    document.getElementById("keteranganPelayanan").value = "";
    var fileInput = document.getElementById("gambarPelayanan");
    fileInput.value = ""; 
    var previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';
}

export { AddServiceModal };