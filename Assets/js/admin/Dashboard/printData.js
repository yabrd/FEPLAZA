function printCetakTable(HistoryData) {
    let printDocument = window.open('', '_blank');
    printDocument.document.open();
    printDocument.document.write(`
        <html>
            <head>
                <title>Laporan Booking Pelanggan</title>
                <link href="../Assets/css/admin/PrintData.css" rel="stylesheet">
            </head>
            <body>
                <div class="button-container">
                    <button id="printButton" onclick="window.print()">Cetak Laporan</button>
                </div>
                <div id="cetakTableContainer" class="container">
                    <h2 class="text-center mb-4">Laporan Booking Pelanggan</h2>
                    <table id="CetakTable" class="table table-striped table-bordered">
                        <thead class="thead-dark">
                            <tr>
                                <th style="width: 5%;">No</th>
                                <th style="width: 10%;">Nama</th>
                                <th style="width: 10%;">Nomer HP</th>
                                <th style="width: 10%;">Waktu</th>
                                <th style="width: 10%;">Tanggal</th>
                                <th style="width: 10%;">Pesan</th>
                                <th style="width: 10%;">Service</th>
                                <th style="width: 10%;">Harga</th>
                            </tr>
                        </thead>
                        <tbody id="CetakTableDisplay">
                            ${HistoryData.map((item, index) => `
                                <tr>
                                    <td>${index + 1}</td>
                                    <td>${item.nama_booking}</td>
                                    <td>${item.nomerhp_booking}</td>
                                    <td>${item.waktu_booking}</td>
                                    <td>${item.tanggal_booking}</td>
                                    <td>${item.pesan_booking}</td>
                                    <td>${item.order_layanan || ''}</td>
                                    <td>Rp. ${item.harga_booking}</td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
                <script>
                    window.onbeforeprint = function() {
                        document.titleOriginal = document.title;
                        document.title = '';
                    };
                    window.onafterprint = function() {
                        document.title = document.titleOriginal;
                    };
                    window.onload = function() {
                        document.getElementById('printButton').style.display = 'inline-block';
                    };
                </script>
            </body>
        </html>
    `);
    printDocument.document.close();
}

export { printCetakTable };