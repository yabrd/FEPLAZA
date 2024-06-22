fetchGetDataLayanan();

function fetchGetDataLayanan() {
    // const url = 'http://localhost/BEPLAZA/API/api.php/layanan';
    const url = 'https://beplazabarber.my.id/API/api.php/layanan';

    fetch(url)
        .then(response => response.json())
        .then(data => {
            // Panggil fungsi untuk menampilkan data layanan
            displayLayanan(data);
        })
        .catch(error => {
            // Handle error
            console.error('Error:', error);
        });
}

function displayLayanan(layananData) {
    const layananContainer = document.getElementById('layanan-container');

    layananData.forEach(layanan => {
        console.log(layanan.tampilkan)
        if (layanan.tampilkan === "1") {
            const layananElement = document.createElement('div');
            layananElement.classList.add('col-lg-3', 'col-md-4', 'col-sm-6', 'mb-4');

            layananElement.innerHTML = `
                <div class="price-item">
                    <div class="price-img">
                        <img src="${layanan.gambar}" alt="${layanan.nama}">
                    </div>
                    <div class="price-text">
                        <h2>${layanan.nama}</h2>
                        <h3>Rp. ${layanan.harga}</h3>
                        <p>${layanan.keterangan}</p>
                    </div>
                </div>
            `;

            layananContainer.appendChild(layananElement);
        }
    });
}