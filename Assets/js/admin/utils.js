function formatRupiah(angka) {
    var reverse = angka.toString().split('').reverse().join(''),
        ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');
    return ribuan;
}

function setMinDate(tanggalFieldId) {
    var inputTanggal = document.getElementById(tanggalFieldId);
    if (inputTanggal) {
        
        var Hours = new Date();
        Hours.setHours(Hours.getHours() + 7);
        var today = Hours.toISOString().split('T')[0];
        inputTanggal.min = today;
    } else {
        setTimeout(setMinDate, 1000);
    }
}

function enableWaktu(tanggalFieldId, waktuFieldId) {
    var tanggalInput = document.getElementById(tanggalFieldId);
    var tanggal = tanggalInput.value;

    if (tanggal) {
        fetchGetBookedTimes(tanggal, waktuFieldId);
    } else {
        var waktuSelect = document.getElementById(waktuFieldId);
        waktuSelect.disabled = true;
        waktuSelect.innerHTML = "";
    }
}

function fetchGetBookedTimes(tanggal, waktuFieldId) {
    const tanggalFormatted = tanggal.split('-').join('');
    const url = `http://localhost/BEPLAZA/API/api.php/booking/${tanggalFormatted}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayBookedTimes(data, waktuFieldId);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayBookedTimes(bookedTimes, waktuFieldId) {
    // Data waktu yang tersedia
    const availableTimes = WatchData.filter(time => !bookedTimes.includes(time));

    // Menyimpan waktu yang tersedia ke dalam elemen select
    var waktuSelect = document.getElementById(waktuFieldId);
    waktuSelect.disabled = false;
    waktuSelect.innerHTML = "";

    availableTimes.forEach(function(waktu) {
        // Menghapus detik dari waktu
        var displayTime = waktu.slice(0);
        
        var option = document.createElement("option");
        option.text = displayTime;
        option.value = waktu;
        waktuSelect.add(option);
    });
}

const WatchData = [
    "08:00 - 08:30", "08:30 - 09:00", "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11.00",
    "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30", "12:30 - 13:00", "13:00 - 13:30", "13:30 - 14.00",
    "14:00 - 14:30", "14:30 - 15:00", "15:00 - 15:30", "15:30 - 16:00", "16:00 - 16:30"
];

export { formatRupiah, enableWaktu, setMinDate };