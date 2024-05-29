import { displayBookingTable } from './BookingAll.js';
import { createBookingForm } from './AddBooking.js';
import { injectFilterSection } from './rekap.js';

let CurrentBookingListTable = 1;
let CurrentBookingHistoryTable = 1;
let BookingData = []; // Store fetched booking data

// Fungsi untuk mengambil data Booking dari API
function fetchGetDataBooking() {
    const url = 'http://localhost/BEPLAZA/API/api.php/booking';

    fetch(url)
    .then(response => response.json())
    .then(data => {

        BookingData = data;
        displayBookingTable(BookingData, CurrentBookingListTable, 'apply');
        displayBookingTable(BookingData, CurrentBookingHistoryTable, 'edit');
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
        displayBookingTable(BookingData, CurrentBookingListTable, 'apply');
    }
});

document.getElementById('NextBookingListTable').addEventListener('click', function () {
    if (CurrentBookingListTable < Math.ceil(BookingData.length / 5)) {
        CurrentBookingListTable++;
        displayBookingTable(BookingData, CurrentBookingListTable, 'apply');
    }
});

document.getElementById('PrevBookingHistoryTable').addEventListener('click', function () {
    if (CurrentBookingHistoryTable > 1) {
        CurrentBookingHistoryTable--;
        displayBookingTable(BookingData, CurrentBookingHistoryTable, 'edit');
    }
});

document.getElementById('NextBookingHistoryTable').addEventListener('click', function () {
    if (CurrentBookingHistoryTable < Math.ceil(BookingData.length / 5)) {
        CurrentBookingHistoryTable++;
        displayBookingTable(BookingData, CurrentBookingHistoryTable, 'edit');
    }
});

injectFilterSection();
fetchGetDataBooking();
createBookingForm('add');

export { resetTable };
