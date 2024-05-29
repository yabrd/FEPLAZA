function injectFilterSection() {
    const filterSectionHTML = `
        <div class="filter-section-container">
            <h3>Periode Riwayat</h3>
            <div class="btn-group-center">
                <button id="filterToday" type="button" class="btn btn-primary">Hari Ini</button>
                <button id="filterWeek" type="button" class="btn btn-primary">1 Minggu</button>
                <button id="filterMonth" type="button" class="btn btn-primary">1 Bulan</button>
                <button id="filterTwoMonths" type="button" class="btn btn-primary">3 Bulan</button>
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

export { injectFilterSection };