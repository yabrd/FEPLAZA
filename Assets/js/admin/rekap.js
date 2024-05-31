let endDateInput;
let startDateInput;

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
                    <button id="DownloadButton" class="btn btn-primary">Download</button>
                </div>
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

                    startDateInput = new Date(startDateValue);
                    startDateInput.setHours(0, 0, 0, 0);

                    endDateInput = new Date(endDateValue);
                    endDateInput.setHours(0, 0, 0, 0);
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

function isDateAfter(dateString, period) {
    const parts = dateString.split("-");
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);

    // Membuat objek Date dari tanggal yang diuraikan
    const dateFromDatabase = new Date(year, month, day);
    dateFromDatabase.setHours(0, 0, 0, 0); // Mengatur waktu menjadi 00:00:00

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
            startDate = startDateInput;
            endDate = endDateInput;
            break;
        default:
            return "Invalid period"; // Jika input tidak valid
    }
    
    // Mengatur waktu menjadi 00:00:00
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    // Fungsi pembantu untuk membandingkan hanya tanggal tanpa waktu
    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    // Mengembalikan true jika tanggal dari database setelah referenceDate
    // dan tidak lebih dari hari ini
    return formatDate(dateFromDatabase) >= formatDate(startDate) && formatDate(dateFromDatabase) <= formatDate(endDate);
}

export { injectFilterSection, isDateAfter };