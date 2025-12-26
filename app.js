// ========== FUNGSI TANGGAL ABSENSI ==========
function setupAttendanceDateSelection() {
    const todayRadio = document.getElementById('todayDate');
    const otherDateRadio = document.getElementById('otherDate');
    const dateSelectorSection = document.getElementById('date-selector-section');
    const attendanceDateInput = document.getElementById('attendance-date');
    
    // Set default tanggal hari ini
    if (attendanceDateInput) {
        attendanceDateInput.value = formatDateForInput(new Date());
    }
    
    // Event listener untuk radio button
    if (todayRadio && otherDateRadio) {
        todayRadio.addEventListener('change', function() {
            if (this.checked) {
                dateSelectorSection.classList.add('hidden');
            }
        });
        
        otherDateRadio.addEventListener('change', function() {
            if (this.checked) {
                dateSelectorSection.classList.remove('hidden');
                if (attendanceDateInput) {
                    attendanceDateInput.focus();
                }
            }
        });
    }
    
    // Update event listener untuk tombol absensi
    document.querySelectorAll('.attendance-btn').forEach(button => {
        button.addEventListener('click', async function() {
            if (!currentUser) {
                showNotification('Login sebagai admin dulu!', 'error');
                return;
            }
            
            const status = this.getAttribute('data-type');
            let selectedDate = '';
            let dateLabel = '';
            
            // Tentukan tanggal berdasarkan pilihan
            if (todayRadio && todayRadio.checked) {
                selectedDate = formatDateForInput(new Date());
                dateLabel = 'hari ini';
            } else if (otherDateRadio && otherDateRadio.checked) {
                selectedDate = attendanceDateInput ? attendanceDateInput.value : '';
                
                if (!selectedDate) {
                    showNotification('Pilih tanggal terlebih dahulu!', 'error');
                    return;
                }
                
                const dateObj = new Date(selectedDate);
                dateLabel = `tanggal ${formatDate(dateObj)}`;
            }
            
            // Validasi tidak bisa input tanggal di masa depan
            const today = new Date();
            const selectedDateObj = new Date(selectedDate);
            today.setHours(0, 0, 0, 0);
            selectedDateObj.setHours(0, 0, 0, 0);
            
            if (selectedDateObj > today) {
                showNotification('Tidak bisa input absensi untuk tanggal di masa depan!', 'error');
                return;
            }
            
            // Konfirmasi
            if (confirm(`Simpan absensi ${status} untuk ${dateLabel}?`)) {
                const done = showLoading(this);
                await saveAttendance(selectedDate, status);
                done();
                
                // Reset ke hari ini setelah simpan
                if (todayRadio) todayRadio.checked = true;
                if (dateSelectorSection) dateSelectorSection.classList.add('hidden');
                if (attendanceDateInput) {
                    attendanceDateInput.value = formatDateForInput(new Date());
                }
            }
        });
    });
}

// ========== FUNGSI QUICK DATE SELECTION ==========
function setupQuickDateSelection() {
    // Buat tombol quick date di dalam form tanggal
    const dateSelectorSection = document.getElementById('date-selector-section');
    const attendanceDateInput = document.getElementById('attendance-date');
    
    if (dateSelectorSection && attendanceDateInput) {
        // Tambahkan tombol quick date
        const quickDateButtons = `
            <div class="col-md-8">
                <label class="form-label">Pilih Cepat:</label>
                <div class="btn-group btn-group-sm w-100" role="group">
                    <button type="button" class="btn btn-outline-secondary quick-date-btn" data-days="-1">
                        <i class="fas fa-arrow-left"></i> Kemarin
                    </button>
                    <button type="button" class="btn btn-outline-secondary quick-date-btn" data-days="-2">
                        2 Hari Lalu
                    </button>
                    <button type="button" class="btn btn-outline-secondary quick-date-btn" data-days="-3">
                        3 Hari Lalu
                    </button>
                    <button type="button" class="btn btn-outline-secondary quick-date-btn" data-days="-7">
                        1 Minggu Lalu
                    </button>
                </div>
                <div class="alert alert-info mt-2">
                    <i class="fas fa-info-circle"></i> Pilih tanggal untuk input absensi yang terlupa.
                </div>
            </div>
        `;
        
        // Update HTML
        const row = dateSelectorSection.querySelector('.row');
        if (row) {
            row.innerHTML = `
                <div class="col-md-4">
                    <label for="attendance-date" class="form-label">Pilih Tanggal</label>
                    <input type="date" class="form-control" id="attendance-date">
                </div>
                ${quickDateButtons}
            `;
            
            // Tambahkan event listener untuk quick date buttons
            document.querySelectorAll('.quick-date-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const daysOffset = parseInt(this.getAttribute('data-days'));
                    const targetDate = new Date();
                    targetDate.setDate(targetDate.getDate() + daysOffset);
                    
                    if (attendanceDateInput) {
                        attendanceDateInput.value = formatDateForInput(targetDate);
                    }
                    
                    // Tampilkan notifikasi
                    const formattedDate = formatDate(targetDate);
                    showNotification(`Tanggal diatur ke: ${formattedDate}`, 'info');
                });
            });
        }
    }
}
