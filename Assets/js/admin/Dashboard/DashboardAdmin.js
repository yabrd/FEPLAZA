import { displayBookingTable } from './bookingAll.js';
import { createBookingForm } from './addBooking.js';
import { injectFilterSection, NewPeriodDate } from './filterData.js';
import { printCetakTable } from './printData.js';

let currentBookingListTable = 1;
let currentBookingHistoryTable = 1;
let bookingData = []; // Store fetched booking data
let historyData = []; // Store fetched booking data
let selectedFilter = 'filterAllTime'; // Default filter
let rangeHistory = undefined;

// Fungsi untuk menampilkan loading spinner
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loader';
    loader.style.position = 'absolute';
    loader.style.top = '50%';
    loader.style.left = '50%';
    loader.style.transform = 'translate(-50%, -50%)';
    loader.style.zIndex = '1000';
    loader.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';
    document.body.appendChild(loader);
}

// Fungsi untuk menghilangkan loading spinner
function hideLoading() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.remove();
    }
}

// Fungsi untuk mengambil data Booking dari API dengan retry logic
async function fetchbookingData() {
    const bookingAPI = 'https://beplazabarber.my.id/API/api.php/bookingNoBookingPrice';
    let retries = 3; // Jumlah maksimum percobaan
    let attempts = 0;

    while (attempts < retries) {
        try {
            showLoading();
            const response = await fetch(bookingAPI);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            bookingData = await response.json();
            displayBookingTable(bookingData, currentBookingListTable, 'apply');
            hideLoading();
            break; // Keluar dari loop jika berhasil
        } catch (error) {
            console.error('Error fetching data, retrying...', error);
            attempts++;
            if (attempts === retries) {
                console.error('Max retries reached. Failed to fetch data.');
                hideLoading();
            }
            // Tunggu sebelum mencoba lagi
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

// Fungsi untuk mengambil data History dari API dengan retry logic
async function fetchhistoryData(rangeHistory) {
    let historyAPI;

    if (!rangeHistory) {
        historyAPI = 'https://beplazabarber.my.id/API/api.php/bookingNoRange/';
    } else {
        historyAPI = `https://beplazabarber.my.id/API/api.php/bookingRange/${rangeHistory}`;
    }

    let retries = 3; // Jumlah maksimum percobaan
    let attempts = 0;

    while (attempts < retries) {
        try {
            showLoading();
            const response = await fetch(historyAPI);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            historyData = await response.json();
            displayBookingTable(historyData, currentBookingHistoryTable, 'edit');
            hideLoading();
            break; // Keluar dari loop jika berhasil
        } catch (error) {
            console.error('Error fetching data, retrying...', error);
            attempts++;
            if (attempts === retries) {
                console.error('Max retries reached. Failed to fetch data.');
                hideLoading();
            }
            // Tunggu sebelum mencoba lagi
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
}

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

export { resetTable };