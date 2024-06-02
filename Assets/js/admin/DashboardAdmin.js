import { displayBookingTable } from './BookingAll.js';
import { createBookingForm } from './AddBooking.js';
import { injectFilterSection, generatePDF, NewPeriodDate } from './rekap.js';

let CurrentBookingListTable = 1;
let CurrentBookingHistoryTable = 1;
let BookingData = []; // Store fetched booking data
let HistoryData = []; // Store fetched booking data
let selectedFilter = 'filterAllTime'; // Default filter
let RangeHistory;

// Fungsi untuk mengambil data Booking dari API
function fetchBookingData() {
    const BookingAPI = 'http://localhost/BEPLAZA/API/api.php/bookingNoBookingPrice';

    fetch(BookingAPI)
        .then(response => response.json())
        .then(data => {
            BookingData = data;
            // Tampilkan data dengan filter yang dipilih
            displayBookingTable(BookingData, CurrentBookingListTable, 'apply', selectedFilter);
        })
        .catch(error => {
            console.error('Error:', error);
        });

    document.getElementById('PrevBookingListTable').addEventListener('click', function () {
        if (CurrentBookingListTable > 1) {
            CurrentBookingListTable--;
            displayBookingTable(BookingData, CurrentBookingListTable, 'apply', selectedFilter);
        }
    });
    
    document.getElementById('NextBookingListTable').addEventListener('click', function () {
        if (CurrentBookingListTable < Math.ceil(BookingData.length / 5)) {
            CurrentBookingListTable++;
            displayBookingTable(BookingData, CurrentBookingListTable, 'apply', selectedFilter);
        }
    });
}

function fetchHistoryData(RangeHistory) {
    let HistoryAPI;

    if (!RangeHistory) {
        HistoryAPI = 'http://localhost/BEPLAZA/API/api.php/bookingNoRange/';
    } else {
        HistoryAPI = `http://localhost/BEPLAZA/API/api.php/bookingRange/${RangeHistory}`;
    }

    fetch(HistoryAPI)
        .then(response => response.json())
        .then(data => {
            HistoryData = data;
            // Tampilkan data dengan filter yang dipilih
            displayBookingTable(HistoryData, CurrentBookingHistoryTable, 'edit', selectedFilter);
        })
        .catch(error => {
            console.error('Error:', error);
        });

        document.getElementById('PrevBookingHistoryTable').addEventListener('click', function () {
            if (CurrentBookingHistoryTable > 1) {
                CurrentBookingHistoryTable--;
                displayBookingTable(HistoryData, CurrentBookingHistoryTable, 'edit', selectedFilter);
            }
        });
        
        document.getElementById('NextBookingHistoryTable').addEventListener('click', function () {
            if (CurrentBookingHistoryTable < Math.ceil(HistoryData.length / 5)) {
                CurrentBookingHistoryTable++;
                displayBookingTable(HistoryData, CurrentBookingHistoryTable, 'edit', selectedFilter);
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
                        RangeHistory = NewPeriodDate(selectedFilter);
                        fetchHistoryData(RangeHistory);
                    });
                } 
            }
            else if (selectedFilter === 'filterAllTime') {
                RangeHistory = undefined;
                fetchHistoryData(RangeHistory);
            }
            else{
                RangeHistory = NewPeriodDate(selectedFilter);
                fetchHistoryData(RangeHistory);
            }
        });
    });
    const DownloadButtons = document.querySelectorAll('#DownloadButton');
    DownloadButtons.forEach(button => {
        button.addEventListener('click', function () {    
            generatePDF();
        });
    });
}

function resetTable() {
    CurrentBookingListTable = 1;
    CurrentBookingHistoryTable = 1;
    fetchBookingData();
    fetchHistoryData(RangeHistory);
}

fetchBookingData();
fetchHistoryData(RangeHistory);
injectFilterSection();
setupFilterButtons();
createBookingForm('add');

export { resetTable };