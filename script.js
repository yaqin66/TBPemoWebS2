// DOM Elements
const personalForm = document.getElementById('personalForm');
const clearBtn = document.getElementById('clearBtn');
const dataList = document.getElementById('dataList');
const dataCount = document.getElementById('dataCount');
const notification = document.getElementById('notification');

// Data key for localStorage
const STORAGE_KEY = 'personalData';

// Load data from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
    loadAndDisplayData();
    
    // Set today as default date for dob
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dob').value = today;
});

// Form submit handler
personalForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Get form values
    const personalData = {
        id: Date.now(), // Unique ID based on timestamp
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dob: document.getElementById('dob').value,
        gender: document.getElementById('gender').value,
        address: document.getElementById('address').value,
        timestamp: new Date().toLocaleString('id-ID')
    };
    
    // Save data to localStorage
    saveData(personalData);
    
    // Show notification
    showNotification('Data berhasil disimpan!');
    
    // Reset form
    personalForm.reset();
    
    // Set today as default date for dob
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('dob').value = today;
    
    // Reload data display
    loadAndDisplayData();
});

// Clear all data button
clearBtn.addEventListener('click', () => {
    if (confirm('Apakah Anda yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.')) {
        localStorage.removeItem(STORAGE_KEY);
        showNotification('Semua data telah dihapus');
        loadAndDisplayData();
    }
});

// Function to save data to localStorage
function saveData(data) {
    let existingData = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    existingData.push(data);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
}

// Function to load and display data from localStorage
function loadAndDisplayData() {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    
    // Update data count
    dataCount.textContent = data.length;
    
    // Clear current data list
    dataList.innerHTML = '';
    
    // If no data, show empty state
    if (data.length === 0) {
        dataList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-database"></i>
                <h3>Belum ada data</h3>
                <p>Data personal yang Anda simpan akan muncul di sini</p>
            </div>
        `;
        return;
    }
    
    // Sort data by most recent first
    data.sort((a, b) => b.id - a.id);
    
    // Display each data item
    data.forEach(item => {
        const dataItem = document.createElement('div');
        dataItem.className = 'data-item';
        dataItem.innerHTML = `
            <div class="data-header">
                <div class="data-name">${item.name}</div>
                <div class="data-timestamp">${item.timestamp}</div>
            </div>
            <div class="data-email">${item.email}</div>
            <div class="data-info">
                <div class="info-item">
                    <i class="fas fa-phone"></i>
                    <span>${item.phone}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-birthday-cake"></i>
                    <span>${formatDate(item.dob)}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-venus-mars"></i>
                    <span>${item.gender}</span>
                </div>
            </div>
            <div class="info-item" style="margin-top: 10px;">
                <i class="fas fa-home"></i>
                <span>${item.address}</span>
            </div>
        `;
        dataList.appendChild(dataItem);
    });
}

// Function to format date from YYYY-MM-DD to DD/MM/YYYY
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

// Function to show notification
function showNotification(message) {
    notification.querySelector('span').textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Show initial notification on first visit
setTimeout(() => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    if (data.length === 0) {
        showNotification('Selamat datang! Mulai isi data personal Anda.');
    }
}, 1000);
