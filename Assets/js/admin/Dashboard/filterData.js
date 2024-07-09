let startDateUI;
let endDateUI;

function injectFilterSection() {
    const filterSectionHTML = `
        <div class="filter-section-container">
            <div class="btn-group" role="group" aria-label="Button group with nested dropdown">
                <button id="DownloadButton" type="button" class="btn btn-primary">Download</button>
                <div id="dropdownMenu" class="btn-group" role="group">
                    <button type="button" class="btn dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">Filter Periode</button>
                    <ul class="dropdown-menu">
                        <li><a id="filterToday" class="dropdown-item">Hari Ini</a></li>
                        <li><a id="filterWeek" class="dropdown-item">1 Minggu</a></li>
                        <li><a id="filterMonth" class="dropdown-item">1 Bulan</a></li>
                        <li><a id="filterThreeMonths" class="dropdown-item">3 Bulan</a></li>
                        <li><a id="filterAllTime" class="dropdown-item">Semua</a></li>
                        <li><a id="filterInputUser" class="dropdown-item">Manual</a></li>
                    </ul>
                </div>
            </div>
            <div id="manualFilterSection" class="manual-filter-horizontal" style="display: none;">
                <div class="input-group">
                    <span class="input-group-text">Tanggal Awal</span>
                    <input id="startDate" type="date" class="form-control">
                </div>
                <div class="input-group">
                    <span class="input-group-text">Tanggal Akhir</span>
                    <input id="endDate" type="date" class="form-control">
                </div>
                <button id="filterButton" type="button" class="btn btn-primary">Filter</button>
            </div>
        </div>
    `;

    const container = document.getElementById('filterSectionContainer');
    if (container) {
        container.innerHTML = filterSectionHTML;
        const filterInputUser = document.getElementById('filterInputUser');
        if (filterInputUser) {
            filterInputUser.addEventListener('click', toggleManualFilterSection);

            const filterButton = document.getElementById('filterButton');
            if (filterButton) {
                filterButton.addEventListener('click', function () {
                    const startDateValue = document.getElementById('startDate').value;
                    const endDateValue = document.getElementById('endDate').value;
                    startDateUI = new Date(startDateValue);
                    endDateUI = new Date(endDateValue);
                    console.log(startDateValue);
                    console.log(endDateValue);
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
        manualFilterSection.style.display = 'flex';
    } else {
        manualFilterSection.style.display = 'none';
    }
}

function NewPeriodDate(period) {
    let startDate = new Date();
    let endDate = new Date();
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    
    switch (period) {
        case 'filterToday':
            break;
        case 'filterWeek':
            startDate.setDate(startDate.getDate() - 7);
            break;
        case 'filterMonth':
            startDate.setMonth(startDate.getMonth() - 1);
            break;
        case 'filterThreeMonths':
            startDate.setMonth(startDate.getMonth() - 3);
            break;
        case 'filterInputUser':
            startDate = startDateUI;
            endDate = endDateUI;
            break;
        default:
            return "Invalid period";
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


export { injectFilterSection, NewPeriodDate };