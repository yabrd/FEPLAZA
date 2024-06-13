import { IsImage, CloseModal } from "./utils.js";
let service = []; // Store fetched booking data

function EditServiceModal(service) {
    const modalWrapper = document.createElement('div');
    console.log(service.id_pelayanan);
    console.log(service.nama);
    console.log(service.keterangan);
    console.log(service.harga);
    console.log(service.tampilkan);

    console.log("Keluar Modal EditService");
    modalWrapper.innerHTML += `
        <div id="editModal" class="modal" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Edit Service</h5>
                        <button id="CloseButton" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div id="editalertContainer" class="mt-3 d-none">
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Perhatian!</strong> Ada field yang belum terisi:
                                <ul id="editmissingFieldsList" class="mb-0"></ul>
                            </div>
                        </div>
                        <div id="editsuccessAlertContainer" class="mt-3 d-none">
                            <div class="alert alert-success alert-dismissible fade show" role="alert">
                                Layanan berhasil diupdate! 
                            </div>
                        </div>
                        <form id="editServiceForm">
                            <input type="hidden" class="form-control" id="editIdPelayanan" value="${service.id_pelayanan}" readonly>
                            <div class="mb-3">
                                <label for="editnamaPelayanan" class="form-label">Nama Pelayanan</label>
                                <input type="text" class="form-control" id="editnamaPelayanan" value="${service.nama}">
                            </div>
                            <div class="mb-3">
                                <label for="editketeranganPelayanan" class="form-label">Keterangan</label>
                                <textarea class="form-control" id="editketeranganPelayanan">${service.keterangan}</textarea>
                            </div>
                            <div class="mb-3">
                                <label for="edithargaPelayanan" class="form-label">Harga</label>
                                <input type="number" class="form-control" id="edithargaPelayanan" min="0" value="${service.harga}">
                            </div>
                            <div class="mb-3">
                                <label for="tampilkanPelayanan" class="form-label">Tampilkan Layanan</label>
                                <select name="tampilkanPelayanan" class="form-control" id="tampilkanPelayanan" value="${service.tampilkan}">
                                    <option value="1">Tampilkan</option>
                                    <option value="0">Sembunyikan</option>
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="editgambarPelayanan" class="form-label">Gambar</label>
                                <input type="file" class="form-control" id="editgambarPelayanan"">
                            </div>
                            <div id="editpreviewContainer" class="mb-3">
                                ${service.gambar ? `<img src="${service.gambar}" class="img-thumbnail mt-2 rounded">` : ''}
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button id="btnSaveEdit" type="button" class="btn btn-primary">Simpan Perubahan</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    modalWrapper.querySelector(`#CloseButton`).addEventListener('click', function() {
        CloseModal('editModal');
    });

    modalWrapper.querySelector('#editgambarPelayanan').addEventListener('change', function() {
        editpreviewImage(this);
    });
    
    modalWrapper.querySelector('#btnSaveEdit').addEventListener('click', function() {
        saveEditedService();
    });    

    return modalWrapper;
}

function EditService(serviceId) {
    // Dapatkan data layanan dari server berdasarkan serviceId dan isi modal edit
    const url = `http://localhost/BEPLAZA/API/api.php/layanan/${serviceId}`;
    fetch(url)
        .then(response => response.json())
        .then(serviceData => {
            service = serviceData; // Memperbarui variabel service dengan data yang diterima
            const oldModal = document.getElementById('editModal');
            if (oldModal) {
                oldModal.parentNode.removeChild(oldModal); // Hapus modal lama dari DOM jika ada
            }
            const modalElement = EditServiceModal(service); // Panggil fungsi EditServiceModal dan kirimkan data layanan sebagai argumen
            document.body.appendChild(modalElement); // Tambahkan elemen modal ke dalam body
            $('#editModal').modal('show');
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function editpreviewImage(input) {
    var previewContainer = document.getElementById('editpreviewContainer');
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

function saveEditedService() {
    var button = document.getElementById("btnSaveEdit");
    button.disabled = true;
    setTimeout(function() {
        button.disabled = false;
    }, 5000);

    var id = document.getElementById("editIdPelayanan").value;
    var namaPelayanan = document.getElementById("editnamaPelayanan").value;
    var keteranganPelayanan = document.getElementById("editketeranganPelayanan").value;
    var hargaPelayanan = document.getElementById("edithargaPelayanan").value;
    var tampilkanPelayanan = document.getElementById("tampilkanPelayanan").value;
    var gambarPelayanan = document.getElementById("editgambarPelayanan").files[0];

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
    }  else if (hargaPelayanan < 0) {
        fieldsNotFilled.push("Harga harus lebih dari 0");
    }    
     
    if (gambarPelayanan) {
        if (!IsImage(gambarPelayanan.name)) {
            fieldsNotFilled.push("Gambar harus berupa file gambar (format: .jpg, .jpeg, .png)");
        }
    }

    if (fieldsNotFilled.length > 0) {
        document.getElementById("editmissingFieldsList").innerHTML = fieldsNotFilled.map(function(field) {
            return "<li>" + field + "</li>";
        }).join("");
        document.getElementById("editalertContainer").classList.remove("d-none");
        setTimeout(function() {
            document.getElementById("editmissingFieldsList").innerHTML = "";
            document.getElementById("editalertContainer").classList.add("d-none");
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

    xhr.open("PUT", "http://localhost/BEPLAZA/API/api.php/layanan/"+id, true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.status === 200) {
            if (gambarPelayanan) {
                editsimpanDataGambar(id)
            } 
            else {
                document.getElementById("editsuccessAlertContainer").classList.remove("d-none");
                setTimeout(function() {
                    CloseModal('editModal')
                    document.getElementById(`editsuccessAlertContainer`).classList.add("d-none"); 
                }, 3000); 
            }
        } else {
            console.error("Gagal menambahkan layanan:", xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error("Koneksi error.");
    };

    xhr.send(jsonData);
}

function editsimpanDataGambar(id) {
    var gambarPelayanan = document.getElementById("editgambarPelayanan").files[0];
    var formData = new FormData();
    formData.append("gambar", gambarPelayanan);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost/BEPLAZA/API/api.php/gambarlayanan/"+id, true);
    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById("editsuccessAlertContainer").classList.remove("d-none");
            setTimeout(function() {
                CloseModal('editModal')
                document.getElementById(`editsuccessAlertContainer`).classList.add("d-none"); 
            }, 3000); 
        } else {
            console.error("Gagal menambahkan layanan:", xhr.statusText);
        }
    };
    xhr.onerror = function() {
        console.error("Koneksi error.");
    };

    xhr.send(formData);
}

export { EditService, EditServiceModal };