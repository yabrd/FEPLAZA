import { displayBookingTable } from './bookingAll.js';
import { createBookingForm } from './addBooking.js';
import { injectFilterSection, NewPeriodDate } from './filterData.js';
import { printCetakTable } from './printData.js'

let currentBookingListTable = 1;
let currentBookingHistoryTable = 1;
let bookingData = []; // Store fetched booking data
let historyData = []; // Store fetched booking data
let selectedFilter = 'filterAllTime'; // Default filter
let rangeHistory;

// Fungsi untuk mengambil data Booking dari API
function fetchbookingData() {
    const bookingAPI = 'https://beplazabarber.my.id/API/api.php/bookingNoBookingPrice';

    fetch(bookingAPI)
        .then(response => response.json())
        .then(data => {
            bookingData = data;
            // Tampilkan data dengan filter yang dipilih
            displayBookingTable(bookingData, currentBookingListTable, 'apply');
        })
        .catch(error => {
            console.error('Error:', error);
        });

    document.getElementById('PrevBookingListTable').addEventListener('click', function () {
        if (currentBookingListTable > 1) {
            currentBookingListTable--;
            displayBookingTable(bookingData, currentBookingListTable, 'apply');
        }
    });
    
    document.getElementById('NextBookingListTable').addEventListener('click', function () {
        if (currentBookingListTable < Math.ceil(bookingData.length / 5)) {
            currentBookingListTable++;
            displayBookingTable(bookingData, currentBookingListTable, 'apply');
        }
    });
}

function fetchhistoryData(rangeHistory) {
    let historyAPI;

    if (!rangeHistory) {
        historyAPI = 'https://beplazabarber.my.id/API/api.php/bookingNoRange/';
    } else {
        historyAPI = `https://beplazabarber.my.id/API/api.php/bookingRange/${rangeHistory}`;
    }

    fetch(historyAPI)
        .then(response => response.json())
        .then(data => {
            historyData = data;
            // Tampilkan data dengan filter yang dipilih
            displayBookingTable(historyData, currentBookingHistoryTable, 'edit');
        })
        .catch(error => {
            console.error('Error:', error);
        });

        document.getElementById('PrevBookingHistoryTable').addEventListener('click', function () {
            if (currentBookingHistoryTable > 1) {
                currentBookingHistoryTable--;
                displayBookingTable(historyData, currentBookingHistoryTable, 'edit');
            }
        });
        
        document.getElementById('NextBookingHistoryTable').addEventListener('click', function () {
            if (currentBookingHistoryTable < Math.ceil(historyData.length / 5)) {
                currentBookingHistoryTable++;
                displayBookingTable(historyData, currentBookingHistoryTable, 'edit');
            }
        });
}

// Add event listeners for filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-section-container .btn-group-center .btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            selectedFilter = this.id; // Simpan filter yang dipilih oleh pengguna
            // console.log(`Selected filter: ${selectedFilter}`);
            if (selectedFilter === 'filterInputUser') {
                if (filterButton) {
                    filterButton.addEventListener('click', function() {
                        rangeHistory = NewPeriodDate(selectedFilter);
                        fetchhistoryData(rangeHistory);
                    });
                } 
            }
            else if (selectedFilter === 'filterAllTime') {
                rangeHistory = undefined;
                fetchhistoryData(rangeHistory);
            }
            else{
                rangeHistory = NewPeriodDate(selectedFilter);
                fetchhistoryData(rangeHistory);
            }
        });
    });
    const downloadButton = document.querySelectorAll('#DownloadButton');
    downloadButton.forEach(button => {
        button.addEventListener('click', function () {   
            if (selectedFilter === 'filterAllTime') {
                rangeHistory = undefined;
            }
            printCetakTable(historyData);
        });
    });
}

function resetTable() {
    currentBookingListTable = 1;
    currentBookingHistoryTable = 1;
    fetchbookingData();
    fetchhistoryData(rangeHistory);
}

fetchbookingData();
fetchhistoryData(rangeHistory);
injectFilterSection();
setupFilterButtons();
createBookingForm('add');

export { resetTable };