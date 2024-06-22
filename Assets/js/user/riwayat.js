const id = sessionStorage.getItem('id');
let CurrentBookingListTable = 1;
let CurrentBookingHistoryTable = 1;

function fetchHistoryBooking(id) {
    // const BookingAPI = `http://localhost/BEPLAZA/API/api.php/UserBookingHistory/${id}`;
    const BookingAPI = `http://beplazabarber.my.id/API/api.php/UserBookingHistory/${id}`;

    fetch(BookingAPI)
        .then(response => response.json())
        .then(data => {
            const { successBooking, pendingBooking } = separateBookings(data);
            displayHistoryBooking(successBooking, pendingBooking, CurrentBookingListTable, CurrentBookingHistoryTable);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function separateBookings(bookings) {
    let successBooking = [];
    let pendingBooking = [];

    bookings.forEach(item => {
        if (item.harga_booking !== "") {
            item.status = "Success";
            successBooking.push(item);
        } else {
            const { DateRightNow, hoursRightNow } = timeRightNow();
            const { DateBooking, HoursFirst, HoursLast } = convertBookingTime(item.tanggal_booking, item.waktu_booking);

            if (DateRightNow < DateBooking || (DateRightNow === DateBooking && hoursRightNow < HoursLast)){
                item.status = "Active";
                pendingBooking.push(item);
            } else {
                item.status = "Expired";
                pendingBooking.push(item);
            }
        }
    });

    return { successBooking, pendingBooking };
}

function timeRightNow() {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const DateRightNow = parseInt(`${year}${month}${day}`, 10);

    const hours = now.getHours();
    const minutes = now.getMinutes();
    const hoursRightNow = parseInt(`${hours}${minutes}`, 10);

    return {DateRightNow, hoursRightNow};
}

function convertBookingTime(DateBooking, HoursBooking) {
    DateBooking = DateBooking.split("-").join('');
    DateBooking = parseInt(DateBooking, 10);

    let [ HoursFirst, HoursLast ] = HoursBooking.split(" - ");
    HoursFirst = HoursFirst.split(":").join('');
    HoursFirst = parseInt(HoursFirst, 10);

    HoursLast = HoursLast.split(":").join('');
    HoursLast = parseInt(HoursLast, 10);
    
    return { DateBooking, HoursFirst, HoursLast };
}

fetchHistoryBooking(id);

function displayHistoryBooking(successBooking, pendingBooking, currentPendingPage = 1, currentSuccessPage = 1) {
    const itemsPerPage = 5;

    // Calculate pagination for pending bookings
    const totalPendingPages = Math.ceil(pendingBooking.length / itemsPerPage);
    const pendingStartIndex = (currentPendingPage - 1) * itemsPerPage;
    const pendingEndIndex = pendingStartIndex + itemsPerPage;
    const paginatedPendingBooking = pendingBooking.slice(pendingStartIndex, pendingEndIndex);

    // Calculate pagination for success bookings
    const totalSuccessPages = Math.ceil(successBooking.length / itemsPerPage);
    const successStartIndex = (currentSuccessPage - 1) * itemsPerPage;
    const successEndIndex = successStartIndex + itemsPerPage;
    const paginatedSuccessBooking = successBooking.slice(successStartIndex, successEndIndex);

    const DataPending = document.getElementById('DisplayHistoryDataPending');
    if (!DataPending) return;

    DataPending.innerHTML = paginatedPendingBooking.map((item, index) => `
        <tr>
            <td>${pendingStartIndex + index + 1}</td>
            <td>${item.nama_booking}</td>
            <td>${item.nomerhp_booking}</td>
            <td>${item.waktu_booking}</td>
            <td>${item.tanggal_booking}</td>
            <td>${item.pesan_booking}</td>
            <td>${item.status}</td>
        </tr>
    `).join('');

    const DataSuccess = document.getElementById('DisplayHistoryDataSuccess');
    if (!DataSuccess) return;

    DataSuccess.innerHTML = paginatedSuccessBooking.map((item, index) => `
        <tr>
            <td>${successStartIndex + index + 1}</td>
            <td>${item.nama_booking}</td>
            <td>${item.nomerhp_booking}</td>
            <td>${item.waktu_booking}</td>
            <td>${item.tanggal_booking}</td>
            <td>${item.pesan_booking}</td>
            <td>${item.order_layanan || ''}</td>
            <td>Rp. ${item.harga_booking}</td>
            <td>${item.status}</td>
        </tr>
    `).join('');

    // Update pagination controls for pending bookings
    const prevPending = document.getElementById('prevPending');
    const nextPending = document.getElementById('nextPending');
    prevPending.disabled = currentPendingPage <= 1;
    nextPending.disabled = currentPendingPage >= totalPendingPages;

    // Update pagination controls for success bookings
    const prevSuccess = document.getElementById('prevSuccess');
    const nextSuccess = document.getElementById('nextSuccess');
    prevSuccess.disabled = currentSuccessPage <= 1;
    nextSuccess.disabled = currentSuccessPage >= totalSuccessPages;
}

function changePage(page, type) {
    if (type === 'pending') {
        CurrentBookingListTable = page;
    } else if (type === 'success') {
        CurrentBookingHistoryTable = page;
    }
    fetchHistoryBooking(id);
}