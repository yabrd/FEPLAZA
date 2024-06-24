const id = sessionStorage.getItem('id');

function fetchUserById(id) {
    // const url = `http://localhost/BEPLAZA/API/api.php/User/${id}`;
    const url = `https://beplazabarber.my.id/API/api.php/User/${id}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Mengisi nilai ke dalam elemen HTML
            document.getElementById('nama_booking').value = data.username;
            document.getElementById('nomerhp_booking').value = data.no_telp;
            console.log(data.username);
            console.log(data.no_telp);
        })
}
fetchUserById(id)

const WatchData = [
    "08:00 - 08:30", "08:30 - 09:00", "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00",
    "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30", "12:30 - 13:00", "13:00 - 13:30", "13:30 - 14:00",
    "14:00 - 14:30", "14:30 - 15:00", "15:00 - 15:30", "15:30 - 16:00", "16:00 - 16:30"
];

function setMinDate() {
    var inputTanggal = document.getElementById('tanggal');
    if (inputTanggal) {
        
        var Hours = new Date();
        Hours.setHours(Hours.getHours() + 7);
        var today = Hours.toISOString().split('T')[0];
        inputTanggal.min = today;
    } else {
        setTimeout(setMinDate, 1000);
    }
}

setMinDate();

function enableWaktu() {
    var tanggalInput = document.getElementById("tanggal");
    var waktuSelect = document.getElementById("waktu");

    if (tanggalInput.value) {
        fetchGetBookedTimes(tanggalInput.value);
        waktuSelect.disabled = false;
    } else {
        waktuSelect.disabled = true;
        waktuSelect.innerHTML = '<option value="" disabled selected>Pilih Tanggal Dahulu</option>';
    }
}

function fetchGetBookedTimes(tanggal) {
    const tanggalFormatted = tanggal.split('-').join('');
    // const url = `http://localhost/BEPLAZA/API/api.php/booking/${tanggalFormatted}`;
    const url = `https://beplazabarber.my.id/API/api.php/booking/${tanggalFormatted}`;

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            displayBookedTimes(data, tanggal);
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function displayBookedTimes(bookedTimes, selectedDate) {
    const now = new Date();
    const selectedDateObj = new Date(selectedDate);

    // Data waktu yang tersedia
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${currentHour < 10 ? '0' : ''}${currentHour}:${currentMinutes < 10 ? '0' : ''}${currentMinutes}`;

    let availableTimes = WatchData.filter(time => !bookedTimes.includes(time));

    if (selectedDateObj.toDateString() === now.toDateString()) {
        // Filter out times that are earlier than the current time if the selected date is today
        availableTimes = availableTimes.filter(time => {
            const startTime = time.split(' - ')[0];
            return startTime > currentTime;
        });
    }

    // Menyimpan waktu yang tersedia ke dalam elemen select
    const waktuSelect = document.getElementById("waktu");
    waktuSelect.disabled = false;
    waktuSelect.innerHTML = "";

    if (availableTimes.length === 0) {
        const option = document.createElement("option");
        option.text = "Tidak ada jadwal tersedia, silakan pilih tanggal lain.";
        option.value = "";
        waktuSelect.add(option);
        waktuSelect.disabled = true; // Men-disable select jika tidak ada waktu tersedia
    } else {
        availableTimes.forEach(function(waktu) {
            const option = document.createElement("option");
            option.text = waktu;
            option.value = waktu;
            waktuSelect.add(option);
        });
    }
}

function submitBooking() {
    var nama_booking = document.getElementById("nama_booking").value;
    var nomerhp_booking = document.getElementById("nomerhp_booking").value;
    var tanggal = document.getElementById("tanggal").value;
    var tanggal = document.getElementById("tanggal").value;
    var waktu = document.getElementById("waktu").value;
    var pesan = document.getElementById("pesan").value;

    var fieldsNotFilled = [];

    if (nama_booking === "") {
        fieldsNotFilled.push("Nama Booking");
    }
    if (nomerhp_booking === "") {
        fieldsNotFilled.push("Nomer HP Booking");
    }
    if (tanggal === "") {
        fieldsNotFilled.push("Tanggal");
    }
    if (tanggal === "") {
        fieldsNotFilled.push("Tanggal");
    }
    if (waktu === "") {
        fieldsNotFilled.push("Waktu");
    }
    if (pesan === "") {
        fieldsNotFilled.push("Pesan");
    }

    if (fieldsNotFilled.length > 0) {
        document.getElementById("missingFieldsList").innerHTML = fieldsNotFilled.map(function(field) {
            return "<li>" + field + "</li>";
        }).join("");
        document.getElementById("alertContainer").classList.remove("d-none");
        return;
    }

    var dataToSend = {
        "nama_booking": nama_booking,
        "nomerhp_booking": nomerhp_booking,
        "tanggal": tanggal,
        "waktu": waktu,
        "pesan": pesan
    };

    var jsonData = JSON.stringify(dataToSend);

    var xhr = new XMLHttpRequest();

    // xhr.open("POST", "http://localhost/BEPLAZA/API/api.php/booking", true);
    xhr.open("POST", "https://beplazabarber.my.id/API/api.php/booking", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById("successAlertContainer").classList.remove("d-none");
            setTimeout(function() {
                window.location.href = "?Booking";
            }, 2000); // Redirect setelah 2 detik
        } else {
            console.error("Gagal menambahkan booking:", xhr.statusText);
        }
    };

    xhr.onerror = function() {
        console.error("Koneksi error.");
    };

    xhr.send(jsonData);
}