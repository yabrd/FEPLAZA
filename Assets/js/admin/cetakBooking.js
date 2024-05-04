var currentDate = new Date().toISOString().slice(0,10);
document.getElementById('date-range').setAttribute('value', currentDate + ' - ' + currentDate);

document.getElementById("date-range").addEventListener("click", function() {
    // Inisialisasi flatpickr dalam mode "inline"
    var fp = flatpickr("#date-range-calendar", {
        inline: true, // Mode inline
        dateFormat: "Y-m-d",
        mode: "range", // Aktifkan mode rentang
        onClose: function(selectedDates, dateStr, instance) {
            if (selectedDates.length > 1) { // Pastikan dua tanggal dipilih
                // Ubah format tanggal pertama menjadi tahun, bulan, tanggal saja
                var firstDate = formatDate(selectedDates[0]);
                var secondDate = formatDate(selectedDates[1]);
                // Gabungkan kedua tanggal dalam format yang diinginkan
                document.getElementById("date-range").value = firstDate + " - " + secondDate;
            } else {
                console.log("Harap pilih dua tanggal.");
            }
            fp.destroy(); 
        }
    });
});

// Fungsi untuk mengubah format tanggal menjadi tahun, bulan, tanggal saja
function formatDate(date) {
    var year = date.getFullYear();
    var month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tambah 1 karena indeks bulan dimulai dari 0
    var day = date.getDate().toString().padStart(2, '0');
    return year + "-" + month + "-" + day;
}

function printPDF() {
    // Simpan posisi scroll saat ini
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    document.getElementById('printSection').style.display = 'none';
    addTable();
    document.getElementsByClassName('footer')[0].style.display = 'none';

    // Setelah menambahkan tabel dan selesai mencetak, kembalikan tampilan semula
    window.onafterprint = function() {
        // Kembalikan posisi scroll ke posisi sebelumnya
        window.scrollTo(0, scrollTop);

        // Kembalikan tampilan body dan footer
        document.body.style.position = '';
        document.body.style.top = '';
        document.getElementById('printSection').style.display = 'block';
        document.getElementsByClassName('footer')[0].style.display = 'block';

        // Hilangkan tabel
        var tableContainer = document.getElementById('tableContainer');
        tableContainer.innerHTML = '';
    };
}

function addTable() {
    var dateRange = document.getElementById('date-range').value.split(' - ').map(date => date.replace(/-/g, '')).join('/');

    const url = `http://localhost/BEPLAZA/API/api.php/bookingRange/${dateRange}`;

    // Membuat permintaan HTTP
    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Tabel dihapus dari sini
            var table = document.createElement('table');
            table.style.width = '100%';
            table.style.borderCollapse = 'collapse';
            table.border = '0';
            table.style.marginTop = '30px';
            var tbody = document.createElement('tbody');

            // Buat baris header
            var headerRow = document.createElement('tr');
            var headers = ['No', 'Nama', 'NomerHp', 'Service', 'Waktu', 'Tanggal', 'Pesan', 'Harga'];
            for (var i = 0; i < headers.length; i++) {
                var th = document.createElement('th');
                th.textContent = headers[i];
                th.style.border = '2px solid black';
                th.style.padding = '8px';
                headerRow.appendChild(th);
            }
            tbody.appendChild(headerRow);

            // Isi tabel dengan data
            var totalIncome = 0; // Inisialisasi total pendapatan
            data.forEach((item, index) => {
                var dataRow = document.createElement('tr');
                dataRow.innerHTML = `
                    <td style="border: 2px solid black; padding: 8px;">${index + 1}</td>
                    <td style="border: 2px solid black; padding: 8px;">${item.nama_booking}</td>
                    <td style="border: 2px solid black; padding: 8px;">${item.nomerhp_booking}</td>
                    <td style="border: 2px solid black; padding: 8px;">${item.order_layanan}</td>
                    <td style="border: 2px solid black; padding: 8px;">${item.waktu_booking}</td>
                    <td style="border: 2px solid black; padding: 8px;">${item.tanggal_booking}</td>
                    <td style="border: 2px solid black; padding: 8px;">${item.pesan_booking}</td>
                    <td style="border: 2px solid black; padding: 8px;">${item.harga_booking}</td>
                `;
                totalIncome += parseInt(item.harga_booking); // Menambahkan pendapatan pada setiap iterasi
                tbody.appendChild(dataRow);
            });

            table.appendChild(tbody);

            var tableContainer = document.getElementById('tableContainer');
            tableContainer.innerHTML = ''; // Bersihkan isi sebelum menambahkan tabel baru
            tableContainer.appendChild(table);

            // Tambahkan elemen untuk menampilkan total pendapatan
            var totalIncomeElement = document.createElement('p');
            tableContainer.appendChild(totalIncomeElement);

            // Setelah menambahkan tabel dan keterangan total pendapatan, lanjutkan untuk mencetak
            
            //Tambahkan baris baru untuk total pendapatan ke dalam tabel
            var totalRow = document.createElement('tr');
            var input = document.getElementById('date-range');
            totalRow.innerHTML = `
                <td colspan="7" style="text-align: left; border: 2px solid black; padding: 8px;">Total pendapatan tanggal ${input.value}</td>
                <td style="border: 2px solid black; padding: 8px;">${totalIncome}</td>
            `;
            tbody.appendChild(totalRow);

            window.print();
            
            
        })
        .catch(error => console.error('Error:', error));
}
