// Global variables
let updateInterval = null;

// DOM Elements
const connectionStatus = document.getElementById('connection-status');
const connectBtn = document.getElementById('connect-btn');
const temperatureEl = document.getElementById('temperature');
const humidityEl = document.getElementById('humidity');
const rainfallEl = document.getElementById('rainfall');
const lastUpdateEl = document.getElementById('last-update');
const predictedCropEl = document.getElementById('predicted-crop');
const manualForm = document.getElementById('manual-form');
const manualResult = document.getElementById('manual-result');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('IoT Crop Recommendation System - Frontend Loaded');
    
    // Start fetching data
    startDataFetch();
    
    // Setup event listeners
    connectBtn.addEventListener('click', connectArduino);
    manualForm.addEventListener('submit', handleManualPrediction);
});

// Fetch sensor data from backend
async function fetchSensorData() {
    try {
        const response = await fetch('/api/sensor-data');
        const result = await response.json();
        
        if (result.success) {
            updateUI(result);
        }
    } catch (error) {
        console.error('Error fetching sensor data:', error);
    }
}

// Update UI with sensor data
function updateUI(data) {
    const sensorData = data.data;
    
    // Update connection status
    if (data.connected) {
        connectionStatus.textContent = 'Connected';
        connectionStatus.className = 'status-badge connected';
        connectBtn.textContent = 'Reconnect Arduino';
    } else {
        connectionStatus.textContent = 'Disconnected';
        connectionStatus.className = 'status-badge disconnected';
        connectBtn.textContent = 'Connect Arduino';
    }
    
    // Update sensor values
    temperatureEl.textContent = sensorData.temperature || '--';
    humidityEl.textContent = sensorData.humidity || '--';
    rainfallEl.textContent = sensorData.rainfall || '--';
    
    // Update predicted crop
    if (data.predicted_crop) {
        predictedCropEl.textContent = data.predicted_crop;
    }
    
    // Update last update time
    if (sensorData.timestamp) {
        const date = new Date(sensorData.timestamp * 1000);
        lastUpdateEl.textContent = date.toLocaleTimeString();
    }
}

// Connect/Reconnect Arduino
async function connectArduino() {
    connectBtn.disabled = true;
    connectBtn.textContent = 'Connecting...';
    
    try {
        const response = await fetch('/api/connect', {
            method: 'POST'
        });
        const result = await response.json();
        
        if (result.success) {
            showNotification('Arduino connected successfully!', 'success');
        } else {
            showNotification('Failed to connect Arduino. Check USB connection.', 'error');
        }
    } catch (error) {
        showNotification('Connection error: ' + error.message, 'error');
    } finally {
        connectBtn.disabled = false;
        connectBtn.textContent = 'Connect Arduino';
    }
}

// Handle manual prediction form
async function handleManualPrediction(e) {
    e.preventDefault();
    
    const temperature = parseFloat(document.getElementById('manual-temp').value);
    const humidity = parseFloat(document.getElementById('manual-humidity').value);
    const rainfall = parseFloat(document.getElementById('manual-rainfall').value);
    
    try {
        const response = await fetch('/api/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                temperature: temperature,
                humidity: humidity,
                rainfall: rainfall
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            manualResult.innerHTML = `
                <strong>Predicted Crop:</strong> ${result.predicted_crop}
            `;
            manualResult.classList.add('show');
        }
    } catch (error) {
        manualResult.innerHTML = `
            <strong>Error:</strong> ${error.message}
        `;
        manualResult.classList.add('show');
    }
}

// Start periodic data fetching
function startDataFetch() {
    // Fetch immediately
    fetchSensorData();
    
    // Then fetch every 2 seconds
    updateInterval = setInterval(fetchSensorData, 2000);
}

// Stop data fetching
function stopDataFetch() {
    if (updateInterval) {
        clearInterval(updateInterval);
        updateInterval = null;
    }
}

// Show notification (simple version)
function showNotification(message, type) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 1000;
        animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Handle page visibility change (pause/resume updates when tab is hidden)
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopDataFetch();
    } else {
        startDataFetch();
    }
});

// Log system info
console.log('%cIoT Crop Recommendation System', 'color: #667eea; font-size: 20px; font-weight: bold;');
console.log('%cArduino Uno R3 + ML Powered', 'color: #10b981; font-size: 14px;');
console.log('%cSensors: DHT11 + Raindrops Detection', 'color: #059669; font-size: 12px;');
