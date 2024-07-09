import { displayBookingTable } from './bookingAll.js';
import { createBookingForm } from './addBooking.js';
import { injectFilterSection, NewPeriodDate } from './filterData.js';
import { printCetakTable } from './printData.js'

let currentBookingListTable = 1;
let currentBookingHistoryTable = 1;
let bookingData = []; // Store fetched booking data
let historyData = []; // Store fetched booking data
let selectedFilter = 'filterAllTime'; // Default filter
let rangeHistory = undefined;

// Fungsi untuk mengambil data Booking dari API
function fetchbookingData() {
    const bookingAPI = 'https://beplazabarber.my.id/API/api.php/bookingNoBookingPrice';

    fetch(bookingAPI)
        .then(response => response.json())
        .then(data => {
            bookingData = data;
            displayBookingTable(bookingData, currentBookingListTable, 'apply');
        })
        .catch(error => {
            console.error('Error:', error);
        });

    if (!document.getElementById('PrevBookingListTable').hasAttribute('listener-added')) {
        document.getElementById('PrevBookingListTable').addEventListener('click', function () {
            if (currentBookingListTable > 1) {
                currentBookingListTable--;
                displayBookingTable(bookingData, currentBookingListTable, 'apply');
            }
        });
        document.getElementById('PrevBookingListTable').setAttribute('listener-added', 'true');
    }

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
            displayBookingTable(historyData, currentBookingHistoryTable, 'edit');
        })
        .catch(error => {
            console.error('Error:', error);
        });

    if (!document.getElementById('PrevBookingHistoryTable').hasAttribute('listener-added')) {
        document.getElementById('PrevBookingHistoryTable').addEventListener('click', function () {
            if (currentBookingHistoryTable > 1) {
                currentBookingHistoryTable--;
                displayBookingTable(historyData, currentBookingHistoryTable, 'edit');
            }
        });
        document.getElementById('PrevBookingHistoryTable').setAttribute('listener-added', 'true');
    }

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

function setupFilterButtons() {
    const filterButtons = document.querySelectorAll('.filter-section-container .btn-group-center .btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function () {
            selectedFilter = this.id;
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