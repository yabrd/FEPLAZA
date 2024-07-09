import { displayBookingTable } from './bookingAll.js';
import { createBookingForm } from './addBooking.js';
import { injectFilterSection, NewPeriodDate } from './filterData.js';
import { printCetakTable } from './printData.js';

let currentBookingListTable = 1;
let currentBookingHistoryTable = 1;
let bookingData = []; // Store fetched booking data
let historyData = []; // Store fetched history data
let selectedFilter = 'filterAllTime'; // Default filter
let rangeHistory = undefined;

// Fungsi async untuk mengambil data Booking dari API dengan retry
async function fetchbookingData() {
    const bookingAPI = 'https://beplazabarber.my.id/API/api.php/bookingNoBookingPrice';

    let retryCount = 0;
    const maxRetry = 3;

    while (retryCount < maxRetry) {
        try {
            const response = await fetch(bookingAPI);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            bookingData = data;
            displayBookingTable(bookingData, currentBookingListTable, 'apply');
            break; // Break out of the retry loop on successful fetch
        } catch (error) {
            console.error('Error fetching booking data:', error);
            retryCount++;
            if (retryCount === maxRetry) {
                console.error('Maximum retries exceeded');
            }
        }
    }

    // Setup event listeners after fetching data
    setupBookingTableListeners();
}

// Fungsi async untuk mengambil data History dari API dengan retry
async function fetchhistoryData(rangeHistory) {
    let historyAPI;

    if (!rangeHistory) {
        historyAPI = 'https://beplazabarber.my.id/API/api.php/bookingNoRange/';
    } else {
        historyAPI = `https://beplazabarber.my.id/API/api.php/bookingRange/${rangeHistory}`;
    }

    let retryCount = 0;
    const maxRetry = 3;

    while (retryCount < maxRetry) {
        try {
            const response = await fetch(historyAPI);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            historyData = data;
            displayBookingTable(historyData, currentBookingHistoryTable, 'edit');
            break; // Break out of the retry loop on successful fetch
        } catch (error) {
            console.error('Error fetching history data:', error);
            retryCount++;
            if (retryCount === maxRetry) {
                console.error('Maximum retries exceeded');
            }
        }
    }

    // Setup event listeners after fetching data
    setupHistoryTableListeners();
}

// Setup event listeners untuk tabel booking
function setupBookingTableListeners() {
    // Event listener untuk PrevBookingListTable
    if (!document.getElementById('PrevBookingListTable').hasAttribute('listener-added')) {
        document.getElementById('PrevBookingListTable').addEventListener('click', function () {
            if (currentBookingListTable > 1) {
                currentBookingListTable--;
                displayBookingTable(bookingData, currentBookingListTable, 'apply');
            }
        });
        document.getElementById('PrevBookingListTable').setAttribute('listener-added', 'true');
    }

    // Event listener untuk NextBookingListTable
    if (!document.getElementById('NextBookingListTable').hasAttribute('listener-added')) {
        document.getElementById('NextBookingListTable').addEventListener('click', function () {
            if (currentBookingListTable < Math.ceil(bookingData.length / 5)) {
                currentBookingListTable++;
                displayBookingTable(bookingData, currentBookingListTable, 'apply');
            }
        });
        document.getElementById('NextBookingListTable').setAttribute('listener-added', 'true');
    }
}

// Setup event listeners untuk tabel history
function setupHistoryTableListeners() {
    // Event listener untuk PrevBookingHistoryTable
    if (!document.getElementById('PrevBookingHistoryTable').hasAttribute('listener-added')) {
        document.getElementById('PrevBookingHistoryTable').addEventListener('click', function () {
            if (currentBookingHistoryTable > 1) {
                currentBookingHistoryTable--;
                displayBookingTable(historyData, currentBookingHistoryTable, 'edit');
            }
        });
        document.getElementById('PrevBookingHistoryTable').setAttribute('listener-added', 'true');
    }

    // Event listener untuk NextBookingHistoryTable
    if (!document.getElementById('NextBookingHistoryTable').hasAttribute('listener-added')) {
        document.getElementById('NextBookingHistoryTable').addEventListener('click', function () {
            if (currentBookingHistoryTable < Math.ceil(historyData.length / 5)) {
                currentBookingHistoryTable++;
                displayBookingTable(historyData, currentBookingHistoryTable, 'edit');
            }
        });
        document.getElementById('NextBookingHistoryTable').setAttribute('listener-added', 'true');
    }
}

// Setup event listeners untuk tombol filter dan download
function setupFilterButtons() {
    // Menangani klik pada semua tombol filter
    const filterButtons = document.querySelectorAll('.filter-section-container .dropdown-item');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            const selectedFilter = this.id;

            if (selectedFilter === 'filterInputUser') {
                const filterButton = document.getElementById('filterButton');
                if (filterButton) {
                    filterButton.addEventListener('click', function () {
                        const startDateValue = document.getElementById('startDate').value;
                        const endDateValue = document.getElementById('endDate').value;
                        const startDateUI = new Date(startDateValue);
                        const endDateUI = new Date(endDateValue);
                        rangeHistory = NewPeriodDate(selectedFilter, startDateUI, endDateUI);
                        fetchhistoryData(rangeHistory);
                    });
                }
            } else if (selectedFilter === 'filterAllTime') {
                rangeHistory = undefined;
                fetchhistoryData(rangeHistory);
            } else {
                rangeHistory = NewPeriodDate(selectedFilter);
                fetchhistoryData(rangeHistory);
            }
        });
    });

    // Menangani klik pada tombol download
    const downloadButton = document.getElementById('DownloadButton');
    if (downloadButton) {
        downloadButton.addEventListener('click', function () {
            if (selectedFilter === 'filterAllTime') {
                rangeHistory = undefined;
            }
            printCetakTable(historyData);
        });
    }
}

// Fungsi untuk mereset tabel
function resetTable() {
    currentBookingListTable = 1;
    currentBookingHistoryTable = 1;
    fetchbookingData();
    fetchhistoryData(rangeHistory);
}

// Memanggil fungsi-fungsi untuk setup awal
fetchbookingData();
fetchhistoryData(rangeHistory);
injectFilterSection();
setupFilterButtons();
createBookingForm('add');

// Export fungsi resetTable untuk digunakan di tempat lain jika diperlukan
export { resetTable };