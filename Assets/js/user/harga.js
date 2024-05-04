// Panggil fungsi untuk mengambil data layanan dan menampilkannya
fetchGetDataLayanan()

function fetchGetDataLayanan() {
    const url = 'http://localhost/BEPLAZA/API/api.php/layanan';

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

function fetchGetDataBooking() {
    const url = 'http://localhost/BEPLAZA/API/api.php/layanan';

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
    const layananContainer = document.querySelector('.price .container .row');

    layananData.forEach(layanan => {
        if(layanan.tampilkan === '1'){
        const layananElement = document.createElement('div');
        layananElement.classList.add('col-lg-3');
        layananElement.classList.add('col-md-4');
        layananElement.classList.add('col-sm-6');

        layananElement.innerHTML = `
            <div class="price-item">
                <div class="price-img">
                    <img src="${layanan.gambar}" alt="${layanan.nama}">
                </div>
                <div class="price-text">
                    <h2>${layanan.nama}</h2>
                    <h3>Rp. ${layanan.harga}</h3>
                    ${layanan.keterangan}</>
                </div>
            </div>
        `;

        layananContainer.appendChild(layananElement);
        }
    });
}