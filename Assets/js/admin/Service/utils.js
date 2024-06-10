function IsImage(filename) {
    const allowedExtensions = ['.jpg', '.jpeg', '.png']; // Ekstensi file gambar yang diperbolehkan
    const extension = filename.substring(filename.lastIndexOf('.')).toLowerCase();
    return allowedExtensions.includes(extension);
}

function CloseModal(ModalElement) {
    $(`#${ModalElement}`).modal('hide'); // Menggunakan jQuery untuk menampilkan modal
}

export { IsImage, CloseModal }