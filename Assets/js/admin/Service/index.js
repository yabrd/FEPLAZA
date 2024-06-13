import { EditService } from './EditService.js';
import { DeleteService } from './DeleteService.js';
import { AddServiceModal } from './AddService.js';

// function searchData() {}
document.getElementById('searchButton').addEventListener('click', function() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("ServiceTable");
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
});

// Menampilkan Mendeteksi ID (Add Service) Kemudian Memanggil Modal nya.
document.getElementById('AddService').addEventListener('click', function() {
    const modalElement = AddServiceModal(); // Panggil fungsi AddServiceModal dan simpan hasilnya dalam variabel modalElement
    document.body.appendChild(modalElement); // Tambahkan elemen modal ke dalam body
    $('#tambahPelayananModal').modal('show'); // Menggunakan jQuery untuk menampilkan modal
    AllService();
});

// Menampilkan Daftar Service
function AllService() {
    console.log('tampil');
    const url = 'http://localhost/BEPLAZA/API/api.php/layanan';
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const serviceContainer = document.getElementById('data_service');
            serviceContainer.innerHTML = ''; // Menghapus semua elemen <tr> yang ada sebelumnya
            let iterasi = 1 ;
            data.forEach(Service => {
                const ServiceElement = document.createElement('tr');
                ServiceElement.innerHTML = `
                    <td>${iterasi++}</td>
                    <td class="text-left">${Service.nama}</td>
                    <td class="text-left">${Service.keterangan}</td>
                    <td class="text-center">
                    ${parseInt(Service.tampilkan) === 1 ? 'Ditampilkan' : 'Tidak'}
                    </td>
                    <td>${Service.harga}</td>
                    <td class="text-center" style="min-width: 170px;">
                        <button id="EditButton${Service.id_pelayanan}" class="btn btn-warning text-white">Edit</button>
                        <button id="DeleteButton${Service.id_pelayanan}" class="btn btn-danger text-white">Delete</button>
                    </td>
                `;
                serviceContainer.appendChild(ServiceElement);

                // Menampilkan Mendeteksi ID (Edit Service) Kemudian Memanggil Modal nya.
                document.getElementById(`EditButton${Service.id_pelayanan}`).addEventListener('click', function() {
                    EditService(Service.id_pelayanan);
                    AllService();
                });

                // Menampilkan Mendeteksi ID (Delete Service) Kemudian Memanggil Modal nya.
                document.getElementById(`DeleteButton${Service.id_pelayanan}`).addEventListener('click', function() {
                    DeleteService(Service.id_pelayanan);
                    AllService();
                });
            });

        })
        .catch(error => {
            console.error('Error:', error);
        });
}
AllService();