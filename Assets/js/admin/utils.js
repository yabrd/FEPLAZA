function formatRupiah(angka) {
    var reverse = angka.toString().split('').reverse().join(''),
        ribuan = reverse.match(/\d{1,3}/g);
    ribuan = ribuan.join('.').split('').reverse().join('');
    return ribuan;
}

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

function enableWaktu() {
    var tanggalInput = document.getElementById("tanggal");
    var tanggal = tanggalInput.value;

    if (tanggal) {
        fetchGetBookedTimes(tanggal);
    } else {
        var waktuSelect = document.getElementById("waktu");
        waktuSelect.disabled = true;
        waktuSelect.innerHTML = "";
    }
}

export { formatRupiah };