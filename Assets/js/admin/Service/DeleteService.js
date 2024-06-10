function DeleteService(ServiceId) {
    if (confirm("Apakah Anda yakin ingin menghapus data ini?")) {
        var button = document.getElementById(`DeleteButton${ServiceId}`);

        button.disabled = true;
        setTimeout(function() {
            button.disabled = false;
        }, 5000);

        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", "http://localhost/BEPLAZA/API/api.php/layanan/" + ServiceId, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onload = function() {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                if (response.hasOwnProperty('message')) {
                    var fieldsNotFilled = [];
                    fieldsNotFilled.push(response.message);
                    document.getElementById("missingFieldsListKeterangan").innerHTML = fieldsNotFilled.map(function(field) {
                        return "<li>" + field + "</li>";
                    }).join("");
                    document.getElementById("gagalDeleteKeterangan").classList.remove("d-none");
                    setTimeout(function() {
                        document.getElementById("missingFieldsListKeterangan").innerHTML = "";
                        document.getElementById("gagalDeleteKeterangan").classList.add("d-none");
                    }, 10000);
                    return;
                } 
                document.getElementById(`successDelete`).classList.remove("d-none");
                setTimeout(function() {
                    document.getElementById(`successDelete`).classList.add("d-none"); // Menambahkan kembali class d-none setelah alert ditampilkan
                }, 5000); 
            } else {
                document.getElementById(`gagalDelete`).classList.remove("d-none");
                setTimeout(function() {
                    document.getElementById(`gagalDelete`).classList.add("d-none"); // Menambahkan kembali class d-none setelah alert ditampilkan
                }, 5000); 
                console.error("Gagal menghapus pelayanan:", xhr.statusText);
            }
        };        
        xhr.onerror = function() {
            console.error("Koneksi error.");
        };
        xhr.send();
    }
}

export { DeleteService };