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

function enableWaktu(tanggalFieldId, waktuFieldId, Action) {
    var tanggalInput = document.getElementById(tanggalFieldId);
    var waktuSelect = document.getElementById(waktuFieldId);

    if (tanggalInput.value) {
        fetchGetBookedTimes(tanggalInput.value, waktuFieldId, Action);
        waktuSelect.disabled = false;
    } else {
        waktuSelect.disabled = true;
        waktuSelect.innerHTML = "";
        waktuSelect.innerHTML = '<option value="" disabled selected>Pilih Tanggal Dahulu</option>';
    }
}

function fetchGetBookedTimes(tanggal, waktuFieldId, Action) {
    const tanggalFormatted = tanggal.split('-').join('');
    const url = `https://beplazabarber.my.id/API/api.php/booking/${tanggalFormatted}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayBookedTimes(data, tanggal, waktuFieldId, Action);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayBookedTimes(bookedTimes, tanggal, waktuFieldId, Action) {
    const now = new Date();
    const selectedDateObj = new Date(tanggal);

    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${currentHour < 10 ? '0' : ''}${currentHour}:${currentMinutes < 10 ? '0' : ''}${currentMinutes}`;

    let availableTimes
    if (Action == 'add'){
        availableTimes = WatchData.filter(time => !bookedTimes.includes(time));
    } else{
        availableTimes = WatchData;
    }
    if (Action == 'add' && selectedDateObj.toDateString() === now.toDateString()) {
        availableTimes = availableTimes.filter(time => {
            const startTime = time.split(' - ')[0];
            return startTime > currentTime;
        });
    }

    const waktuSelect = document.getElementById(waktuFieldId);
    waktuSelect.disabled = false;
    waktuSelect.innerHTML = "";

    if (availableTimes.length === 0) {
        const option = document.createElement("option");
        option.text = "Tidak ada jadwal tersedia, silakan pilih tanggal lain.";
        option.value = "";
        waktuSelect.add(option);
        waktuSelect.disabled = true;
    } else {
        availableTimes.forEach(function(waktu) {
            const option = document.createElement("option");
            option.text = waktu;
            option.value = waktu;
            waktuSelect.add(option);
        });
    }
}


const WatchData = [
    "08:00 - 08:30", "08:30 - 09:00", "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11.00",
    "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30", "12:30 - 13:00", "13:00 - 13:30", "13:30 - 14.00",
    "14:00 - 14:30", "14:30 - 15:00", "15:00 - 15:30", "15:30 - 16:00", "16:00 - 16:30"
];

export { formatRupiah, enableWaktu, setMinDate };