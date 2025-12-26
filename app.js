// Aplikasi Absensi Kerja
document.addEventListener('DOMContentLoaded', function() {
    console.log('Aplikasi Absensi dimuat...');
    
    // Elemen DOM
    const btnAbsen = document.getElementById('btn-absen');
    const inputNama = document.getElementById('nama');
    const selectTipe = document.getElementById('tipe-absensi');
    const inputTanggal = document.getElementById('tanggal');
    const daftarAbsensi = document.getElementById('daftar-absensi');
    const totalGaji = document.getElementById('total-gaji');
    
    // Inisialisasi data absensi dari localStorage
    let absensiData = JSON.parse(localStorage.getItem('absensiData')) || [];
    
    // Konfigurasi gaji
    const GAJI_FULL = 50000;
    const GAJI_HALF = 25000;
    const GAJI_TIDAK_MASUK = 0;
    
    // Fungsi untuk format Rupiah
    function formatRupiah(angka) {
        return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ',00';
    }
    
    // Fungsi untuk menyimpan data ke localStorage
    function saveToLocalStorage() {
        localStorage.setItem('absensiData', JSON.stringify(absensiData));
    }
    
    // Fungsi untuk menghitung total gaji
    function hitungTotalGaji() {
        let total = 0;
        
        absensiData.forEach(item => {
            switch(item.tipe) {
                case 'full':
                    total += GAJI_FULL;
                    break;
                case 'half':
                    total += GAJI_HALF;
                    break;
                case 'tidak-masuk':
                    total += GAJI_TIDAK_MASUK;
                    break;
            }
        });
        
        totalGaji.textContent = formatRupiah(total);
        return total;
    }
    
    // Fungsi untuk menampilkan daftar absensi
    function renderDaftarAbsensi() {
        daftarAbsensi.innerHTML = '';
        
        if (absensiData.length === 0) {
            daftarAbsensi.innerHTML = '<p class="empty-message">Belum ada data absensi.</p>';
            return;
        }
        
        // Urutkan berdasarkan tanggal terbaru
        const sortedData = [...absensiData].sort((a, b) => 
            new Date(b.tanggal) - new Date(a.tanggal)
        );
        
        sortedData.forEach((item, index) => {
            const absensiItem = document.createElement('div');
            absensiItem.className = 'absensi-item';
            
            // Tentukan label tipe absensi
            let tipeLabel = '';
            let gaji = 0;
            
            switch(item.tipe) {
                case 'full':
                    tipeLabel = 'Berangkat Kerja (Full)';
                    gaji = GAJI_FULL;
                    break;
                case 'half':
                    tipeLabel = 'Setengah Hari';
                    gaji = GAJI_HALF;
                    break;
                case 'tidak-masuk':
                    tipeLabel = 'Tidak Masuk';
                    gaji = GAJI_TIDAK_MASUK;
                    break;
            }
            
            absensiItem.innerHTML = `
                <div class="absensi-info">
                    <strong>${item.nama}</strong>
                    <span class="absensi-tipe ${item.tipe}">${tipeLabel}</span>
                </div>
                <div class="absensi-detail">
                    <span>Tanggal: ${item.tanggal}</span>
                    <span class="absensi-gaji">${formatRupiah(gaji)}</span>
                </div>
                <button class="btn-hapus" data-index="${index}">Hapus</button>
            `;
            
            daftarAbsensi.appendChild(absensiItem);
        });
        
        // Tambahkan event listener untuk tombol hapus
        document.querySelectorAll('.btn-hapus').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                hapusAbsensi(index);
            });
        });
        
        hitungTotalGaji();
    }
    
    // Fungsi untuk menambah absensi
    function tambahAbsensi() {
        const nama = inputNama.value.trim();
        const tipe = selectTipe.value;
        const tanggal = inputTanggal.value;
        
        // Validasi input
        if (!nama) {
            alert('Silakan masukkan nama karyawan!');
            inputNama.focus();
            return;
        }
        
        if (!tanggal) {
            alert('Silakan pilih tanggal!');
            inputTanggal.focus();
            return;
        }
        
        // Tambah data baru
        const absensiBaru = {
            id: Date.now(),
            nama: nama,
            tipe: tipe,
            tanggal: tanggal,
            waktu: new Date().toLocaleTimeString()
        };
        
        absensiData.push(absensiBaru);
        saveToLocalStorage();
        renderDaftarAbsensi();
        
        // Reset form
        inputNama.value = '';
        selectTipe.value = 'full';
        inputTanggal.value = new Date().toISOString().split('T')[0];
        
        // Tampilkan notifikasi
        alert('Absensi berhasil disimpan!');
        
        console.log('Absensi ditambahkan:', absensiBaru);
    }
    
    // Fungsi untuk menghapus absensi
    function hapusAbsensi(index) {
        if (confirm('Apakah Anda yakin ingin menghapus absensi ini?')) {
            absensiData.splice(index, 1);
            saveToLocalStorage();
            renderDaftarAbsensi();
            alert('Absensi berhasil dihapus!');
        }
    }
    
    // Event Listeners
    btnAbsen.addEventListener('click', tambahAbsensi);
    
    // Enter key untuk input nama
    inputNama.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            tambahAbsensi();
        }
    });
    
    // Set tanggal default ke hari ini
    const today = new Date().toISOString().split('T')[0];
    inputTanggal.value = today;
    inputTanggal.max = today; // Tidak boleh lebih dari hari ini
    
    // Load data saat pertama kali dibuka
    renderDaftarAbsensi();
    
    console.log('Aplikasi siap digunakan. Total data:', absensiData.length);
});
