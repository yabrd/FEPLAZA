import { displayBookingTable } from './BookingAll.js';
import { createBookingForm } from './AddBooking.js';
import { injectFilterSection } from './rekap.js';

let CurrentBookingListTable = 1;
let CurrentBookingHistoryTable = 1;
let BookingData = []; // Store fetched booking data
let selectedFilter = 'filterAllTime'; // Default filter

// Fungsi untuk mengambil data Booking dari API
function fetchGetDataBooking() {
    const url = 'http://localhost/BEPLAZA/API/api.php/booking';

    fetch(url)
    .then(response => response.json())
    .then(data => {
        BookingData = data;
        // Tampilkan data dengan filter yang dipilih
        displayBookingTable(BookingData, CurrentBookingListTable, 'apply', selectedFilter);
        displayBookingTable(BookingData, CurrentBookingHistoryTable, 'edit', selectedFilter);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function resetTable() {
    CurrentBookingListTable = 1;
    CurrentBookingHistoryTable = 1;
    fetchGetDataBooking();
}

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

document.getElementById('PrevBookingHistoryTable').addEventListener('click', function () {
    if (CurrentBookingHistoryTable > 1) {
        CurrentBookingHistoryTable--;
        displayBookingTable(BookingData, CurrentBookingHistoryTable, 'edit', selectedFilter);
    }
});

document.getElementById('NextBookingHistoryTable').addEventListener('click', function () {
    if (CurrentBookingHistoryTable < Math.ceil(BookingData.length / 5)) {
        CurrentBookingHistoryTable++;
        displayBookingTable(BookingData, CurrentBookingHistoryTable, 'edit', selectedFilter);
    }
});

// Add event listeners for filter buttons
function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-section-container .btn-group-center .btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            selectedFilter = this.id; // Simpan filter yang dipilih oleh pengguna
            console.log(`Selected filter: ${selectedFilter}`);
            if (selectedFilter === 'filterInputUser') {
                if (filterButton) {
                    filterButton.addEventListener('click', function() {
                        fetchGetDataBooking();
                    });
                } 
            }
            else{
                fetchGetDataBooking();
            }
        });
    });
    const DownloadButtons = document.querySelectorAll('.filter-section-container .btn-group-center .btn');
}

injectFilterSection();
fetchGetDataBooking();
setupFilterButtons();
createBookingForm('add');

export { resetTable };