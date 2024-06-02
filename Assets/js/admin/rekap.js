let startDateUI;
let endDateUI;

function injectFilterSection() {
    const filterSectionHTML = `
        <div class="filter-section-container">
            <h3>Periode Riwayat</h3>
            <div class="btn-group-center">
                <button id="filterToday" type="button" class="btn btn-primary">Hari Ini</button>
                <button id="filterWeek" type="button" class="btn btn-primary">1 Minggu</button>
                <button id="filterMonth" type="button" class="btn btn-primary">1 Bulan</button>
                <button id="filterThreeMonths" type="button" class="btn btn-primary">3 Bulan</button>
                <button id="filterAllTime" type="button" class="btn btn-primary">Semua</button>
                <button id="filterInputUser" type="button" class="btn btn-primary">Manual</button>
            </div>
            <div id="manualFilterSection" style="display: none;">
                <div class="form-row">
                    <div class="form-group">
                        <input type="text" id="startDate" class="form-control placeholder" placeholder="Tanggal Awal" aria-label="Tanggal Awal" onfocus="(this.type='date')" onblur="(this.type='text')">
                    </div>
                    <div class="form-group">
                        <input type="text" id="endDate" class="form-control placeholder" placeholder="Tanggal Akhir" aria-label="Tanggal Akhir" onfocus="(this.type='date')" onblur="(this.type='text')">
                    </div>
                </div>
                <div class="filter-button-container">
                    <button id="filterButton" class="btn btn-primary">Filter</button>
                </div>
            </div>
            <div class="Download-button-container">
                <button id="DownloadButton" class="btn btn-primary">Download</button>
            </div>
        </div>
    `;


    document.querySelectorAll('input[type="text"]').forEach(input => {
        input.addEventListener('focus', function () {
            this.type = 'date';
            this.classList.remove('placeholder');
        });

        input.addEventListener('blur', function () {
            if (this.value === '') {
                this.type = 'text';
                this.classList.add('placeholder');
            }
        });
    });

    const container = document.getElementById('filterSectionContainer');
    if (container) {
        container.innerHTML = filterSectionHTML;

        // Tambahkan event listener setelah elemen ditambahkan ke DOM
        const filterInputUser = document.getElementById('filterInputUser');
        if (filterInputUser) {
            filterInputUser.addEventListener('click', toggleManualFilterSection);
            
            const filterButton = document.getElementById('filterButton');

            // Menambahkan event listener ke tombol filter
            if (filterButton) {
                filterButton.addEventListener('click', function() {
                    // Mendapatkan nilai dari startDate dan endDate
                    const startDateValue = document.getElementById('startDate').value;
                    const endDateValue = document.getElementById('endDate').value;
                    startDateUI = new Date(startDateValue);
                    endDateUI = new Date(endDateValue);
                });
            } else {
                console.error(`Element with id "filterButton" not found.`);
            }
        } else {
            console.error(`Element with id "filterInputUser" not found.`);
        }
    } else {
        console.error(`Container with id "filterSectionContainer" not found.`);
    }
}

function toggleManualFilterSection() {
    const manualFilterSection = document.getElementById('manualFilterSection');
    if (manualFilterSection.style.display === 'none') {
        manualFilterSection.style.display = 'block';
    } else {
        manualFilterSection.style.display = 'none';
    }
}

function NewPeriodDate(period) {

    // Mengatur tanggal referensi berdasarkan periode yang dipilih
    let startDate = new Date();
    let endDate = new Date(); // Ubah dari const ke let
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    switch (period) {
        case 'filterToday':
            break;
        case 'filterWeek':
            startDate.setDate(startDate.getDate() - 7); // 1 minggu yang lalu
            break;
        case 'filterMonth':
            startDate.setMonth(startDate.getMonth() - 1); // 1 bulan yang lalu
            break;
        case 'filterThreeMonths':
            startDate.setMonth(startDate.getMonth() - 3); // 3 bulan yang lalu
            break;
        case 'filterInputUser':
            startDate = startDateUI;
            endDate = endDateUI;
            break;
        default:
            return "Invalid period"; // Jika input tidak valid
    }
    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}${month}${day}`;
    }
    startDate = formatDate(startDate);
    endDate = formatDate(endDate);
    const RangeHistory = `${startDate}/${endDate}`;
    return RangeHistory;
}

function generatePDF() {
    // Membuat objek jsPDF
    const doc = new jsPDF();

    // Judul PDF
    doc.text("Data Booking Riwayat", 10, 10);

    // Mengambil tabel data
    const table = document.getElementById('HistoryTableDisplay');

    // Mengatur kolom
    const columns = [];
    const headerCells = table.querySelectorAll('thead th');
    headerCells.forEach(cell => {
        columns.push(cell.textContent.trim());
    });

    // Mengatur posisi awal tabel
    let y = 30;

    // Menambahkan header kolom ke dalam dokumen PDF
    let x = 10;
    columns.forEach(column => {
        doc.text(column, x, y);
        x += 40; // Menambahkan jarak antar kolom
    });

    // Mengambil data baris
    const bodyRows = table.querySelectorAll('tbody tr');
    bodyRows.forEach(row => {
        y += 10; // Menambahkan jarak antar baris
        let x = 10; // Mengatur posisi awal kolom
        const cells = row.querySelectorAll('td');
        cells.forEach(cell => {
            doc.text(cell.textContent.trim(), x, y);
            x += 40; // Menambahkan jarak antar kolom
        });
    });

    // Menyimpan dokumen PDF
    doc.save("Data_Booking_Riwayat.pdf");
}

export { injectFilterSection, generatePDF, NewPeriodDate };