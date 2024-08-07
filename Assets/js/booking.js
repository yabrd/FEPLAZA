const id = sessionStorage.getItem('id');

async function fetchUserById(id) {
    try {
        const url = `https://beplazabarber.my.id/API/api.php/User/${id}`;
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        document.getElementById('nama_booking').value = data.username;
        document.getElementById('nomerhp_booking').value = data.no_telp;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}

fetchUserById(id);

const WatchData = [
    "08:00 - 08:30", "08:30 - 09:00", "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00",
    "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30", "12:30 - 13:00", "13:00 - 13:30", "13:30 - 14:00",
    "14:00 - 14:30", "14:30 - 15:00", "15:00 - 15:30", "15:30 - 16:00", "16:00 - 16:30"
];

function setMinDate() {
    var inputTanggal = document.getElementById('tanggal');
    if (inputTanggal) {
        var today = new Date().toISOString().split('T')[0];
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

async function fetchGetBookedTimes(tanggal) {
    try {
        const tanggalFormatted = tanggal.split('-').join('');
        const url = `https://beplazabarber.my.id/API/api.php/booking/${tanggalFormatted}`;
        
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        displayBookedTimes(data, tanggal);
    } catch (error) {
        console.error('Error fetching booked times:', error);
    }
}

function displayBookedTimes(bookedTimes, selectedDate) {
    const now = new Date();
    const selectedDateObj = new Date(selectedDate);

    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTime = `${currentHour < 10 ? '0' : ''}${currentHour}:${currentMinutes < 10 ? '0' : ''}${currentMinutes}`;

    let availableTimes = WatchData.filter(time => !bookedTimes.includes(time));

    if (selectedDateObj.toDateString() === now.toDateString()) {
        availableTimes = availableTimes.filter(time => {
            const startTime = time.split(' - ')[0];
            return startTime > currentTime;
        });
    }

    const waktuSelect = document.getElementById("waktu");
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

async function submitBooking() {
    var nama_booking = document.getElementById("nama_booking").value;
    var nomerhp_booking = document.getElementById("nomerhp_booking").value;
    var tanggal = document.getElementById("tanggal").value;
    var waktu = document.getElementById("waktu").value;
    var pesan = document.getElementById("pesan").value;

    var fieldsNotFilled = [];

    if (nama_booking === "") {
        fieldsNotFilled.push("Nama Booking");
    }
    if (nomerhp_booking === "") {
        fieldsNotFilled.push("Nomor HP Booking");
    }
    if (tanggal === "") {
        fieldsNotFilled.push("Tanggal Booking");
    }
    if (waktu === "") {
        fieldsNotFilled.push("Waktu Booking");
    }
    if (pesan === "") {
        fieldsNotFilled.push("Pesan");
    }

    if (fieldsNotFilled.length > 0) {
        var missingFieldsList = document.getElementById("missingFieldsList");
        missingFieldsList.innerHTML = "";
        fieldsNotFilled.forEach(function(field) {
            var listItem = document.createElement("li");
            listItem.textContent = field;
            missingFieldsList.appendChild(listItem);
        });
        document.getElementById("alertContainer").classList.remove("d-none");
        document.getElementById("successAlertContainer").classList.add("d-none");
        setTimeout(function() {
            document.getElementById("alertContainer").classList.add("d-none");
        }, 5000);
        return;
    }

    var data = {
        nama_booking: nama_booking,
        nomerhp_booking: nomerhp_booking,
        tanggal: tanggal,
        waktu: waktu,
        pesan: pesan
    };

    var url = "https://beplazabarber.my.id/API/api.php/booking";

    try {
        var response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error('Gagal menambahkan booking');
        }

        var responseData = await response.json();
        document.getElementById("successAlertContainer").classList.remove("d-none");
        document.getElementById("alertContainer").classList.add("d-none");
        setTimeout(function() {
            document.getElementById("successAlertContainer").classList.add("d-none");
            window.location.href = "?Booking";
        }, 3000);
    } catch (error) {
        var response = await error.response.json();
        var errorAlert = document.createElement("div");
        errorAlert.classList.add("alert", "alert-danger", "alert-dismissible", "fade", "show");
        errorAlert.setAttribute("role", "alert");
        errorAlert.innerHTML = "Gagal menambahkan booking: " + response.message;
        errorAlert.innerHTML += '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
        document.getElementById("alertContainer").appendChild(errorAlert);

        document.getElementById("alertContainer").classList.remove("d-none");
        document.getElementById("successAlertContainer").classList.add("d-none");

        setTimeout(function() {
            document.getElementById("alertContainer").classList.add("d-none");
        }, 5000);
    }
}