const AllService = async () => {
    const url = 'https://beplazabarber.my.id/API/api.php/layanan';
    try {
        const response = await fetch(url); // Menunggu hingga data diambil dari API
        const data = await response.json(); // Menunggu hingga data diubah menjadi JSON
        
        const serviceContainer = document.getElementById('data_service');
        serviceContainer.innerHTML = ''; // Menghapus semua elemen <tr> yang ada sebelumnya
        let iterasi = 1 ;
        
        data.forEach(Service => {
            const ServiceElement = document.createElement('tr');
            ServiceElement.innerHTML = `
                <td>${iterasi++}</td>
                <td class="text-left">${Service.nama}</td>
                <td class="text-left">${Service.keterangan}</td>
                <td class="text-left">
                ${parseInt(Service.tampilkan) === 1 ? 'Ditampilkan' : 'Tidak'}
                </td>
                <td>${Service.harga}</td>
                <td class="text-left" style="min-width: 170px;">
                    <button class="btn btn-warning" onclick="editService(${Service.id})">Ubah</button>
                    <button id="btn_delete${Service.id_pelayanan}" class="btn btn-danger" onclick="deleteService(${Service.id})">Hapus</button>
                </td>
            `;
            serviceContainer.appendChild(ServiceElement);
        });
    } catch (error) {
        console.error('Error:', error);
    }
};

const editService = async (serviceId) => {
    try {
        const url = `https://beplazabarber.my.id/API/api.php/layanan/${serviceId}`;
        const response = await fetch(url);
        const service = await response.json();

        document.getElementById('editIdPelayanan').value = service.id;
        document.getElementById('editnamaPelayanan').value = service.nama;
        document.getElementById('editketeranganPelayanan').value = service.keterangan;
        document.getElementById('edithargaPelayanan').value = service.harga;
        document.getElementById('tampilkanPelayanan').value = service.tampilkan;

        var previewContainer = document.getElementById('editpreviewContainer');
        previewContainer.innerHTML = '';
        if (service.gambar) {
            var imgElement = document.createElement('img');
            imgElement.setAttribute('src', service.gambar);
            imgElement.setAttribute('class', 'img-thumbnail mt-2 rounded');
            previewContainer.appendChild(imgElement);
        }

        $('#editModal').modal('show');
    } catch (error) {
        console.error('Error:', error);
    }
};

function closeEditModal() {
    $('#editModal').modal('hide'); 
}

AllService()

function searchData() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("data_table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1]; // Column index 1 is for "Nama"
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }       
    }
}

function showTambahPelayananModal() {
    $('#tambahPelayananModal').modal('show'); // Menggunakan jQuery untuk menampilkan modal
}

function closeModal() {
    $('#tambahPelayananModal').modal('hide'); // Menggunakan jQuery untuk menampilkan modal
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

function resetForm() {
    document.getElementById("namaPelayanan").value = "";
    document.getElementById("hargaPelayanan").value = "0";
    document.getElementById("keteranganPelayanan").value = "";
    var fileInput = document.getElementById("gambarPelayanan");
    fileInput.value = ""; 
    var previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';
}

function isImage(filename) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png']; // Ekstensi file gambar yang diperbolehkan
    const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return allowedExtensions.includes(extension);
}

const simpanDataGambar = async () => {
    try {
        const gambarPelayanan = document.getElementById("gambarPelayanan").files[0];

        const formData = new FormData();
        formData.append("gambar", gambarPelayanan);

        const response = await fetch("https://beplazabarber.my.id/API/api.php/gambarlayanan", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            document.getElementById("successAlertContainer").classList.remove("d-none");
            setTimeout(function() {
                closeModal();
                resetForm();
                AllService();
                document.getElementById("successAlertContainer").classList.add("d-none");
            }, 3000);
            console.log(response.statusText);
        } else {
            console.error("Gagal menambahkan layanan:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const editsimpanDataGambar = async (id) => {
    try {
        const gambarPelayanan = document.getElementById("editgambarPelayanan").files[0];

        const formData = new FormData();
        formData.append("gambar", gambarPelayanan);

        const response = await fetch(`https://beplazabarber.my.id/API/api.php/gambarlayanan/${id}`, {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            document.getElementById("editsuccessAlertContainer").classList.remove("d-none");
            setTimeout(function() {
                closeEditModal();
                AllService();
                document.getElementById("editsuccessAlertContainer").classList.add("d-none");
            }, 3000);
        } else {
            console.error("Gagal menambahkan layanan:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};


const simpanDataPelayanan = async () => {
    try {
        const button = document.getElementById("simpanPelayanan");
        button.disabled = true;
        setTimeout(function() {
            button.disabled = false;
        }, 5000);

        const namaPelayanan = document.getElementById("namaPelayanan").value;
        const keteranganPelayanan = document.getElementById("keteranganPelayanan").value;
        const tampilkanPelayanan = document.getElementById("langsungTampilkan").value;
        const hargaPelayanan = document.getElementById("hargaPelayanan").value;
        const gambarPelayanan = document.getElementById("gambarPelayanan").files[0];

        const fieldsNotFilled = [];

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
        } else if (!isImage(gambarPelayanan.name)) {
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

        const dataToSend = {
            "nama": namaPelayanan,
            "keterangan": keteranganPelayanan,
            "harga": hargaPelayanan,
            "tampilkan": tampilkanPelayanan
        };

        const jsonData = JSON.stringify(dataToSend);

        const response = await fetch("https://beplazabarber.my.id/API/api.php/layanan", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: jsonData
        });

        if (response.ok) {
            await simpanDataGambar();
        } else {
            console.error("Gagal menambahkan layanan:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};

const deleteService = async (serviceId) => {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        try {
            const response = await fetch(`https://beplazabarber.my.id/API/api.php/layanan/${serviceId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                const responseData = await response.json();
                if (responseData.hasOwnProperty('message')) {
                    const fieldsNotFilled = [];
                    fieldsNotFilled.push(responseData.message);
                    document.getElementById("missingFieldsListKeterangan").innerHTML = fieldsNotFilled.map(function(field) {
                        return "<li>" + field + "</li>";
                    }).join("");
                    document.getElementById("gagalDeleteKeterangan").classList.remove("d-none");
                    setTimeout(function() {
                        document.getElementById("missingFieldsListKeterangan").innerHTML = "";
                        document.getElementById("gagalDeleteKeterangan").classList.add("d-none");
                    }, 10000);
                    return;
                } 
                document.getElementById('successDelete').classList.remove('d-none');
                AllService();
                setTimeout(function() {
                    document.getElementById('successDelete').classList.add('d-none');
                }, 5000); 
            } else {
                document.getElementById('gagalDelete').classList.remove('d-none');
                setTimeout(function() {
                    document.getElementById('gagalDelete').classList.add('d-none');
                }, 5000); 
                console.error('Gagal menghapus pelayanan:', response.statusText);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }
};

const saveEditedService = async () => {
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
        if (!isImage(gambarPelayanan.name)) {
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

    try {
        const response = await fetch(`https://beplazabarber.my.id/API/api.php/layanan/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: jsonData
        });

        if (response.ok) {
            if (gambarPelayanan) {
                await editsimpanDataGambar(id);
            } else {
                document.getElementById("editsuccessAlertContainer").classList.remove("d-none");
                setTimeout(function() {
                    closeEditModal();
                    AllService();
                    document.getElementById(`editsuccessAlertContainer`).classList.add("d-none"); 
                }, 3000); 
            }
        } else {
            console.error("Gagal mengedit layanan:", response.statusText);
        }
    } catch (error) {
        console.error("Error:", error);
    }
};