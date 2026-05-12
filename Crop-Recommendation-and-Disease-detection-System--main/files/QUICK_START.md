# Quick Start Guide
## IoT Crop Recommendation System

### ⚡ Fast Setup (5 Minutes)

---

## Prerequisites
- Arduino Uno R3
- DHT11 Sensor Module
- Raindrops Detection Sensor Module
- USB Cable
- Computer with Python 3.8+ installed

---

## Step 1: Hardware Setup (2 minutes)

### Connect DHT11:
- **Red wire** (VCC) → Arduino **5V**
- **Black wire** (GND) → Arduino **GND**
- **Yellow wire** (DATA) → Arduino **Pin 2**

### Connect Raindrops Sensor:
- **Red wire** (VCC) → Arduino **5V**
- **Black wire** (GND) → Arduino **GND**
- **Blue wire** (A0) → Arduino **A0**

### Connect Arduino:
- Plug USB cable into Arduino and computer

---

## Step 2: Arduino Software (2 minutes)

1. **Install Arduino IDE**: https://www.arduino.cc/en/software

2. **Install DHT Library**:
   - Arduino IDE → Sketch → Include Library → Manage Libraries
   - Search "DHT sensor library"
   - Install "DHT sensor library" by Adafruit
   - Also install "Adafruit Unified Sensor"

3. **Upload Code**:
   - Open `arduino_code.ino`
   - Tools → Board → Arduino Uno
   - Tools → Port → Select your Arduino port
   - Click Upload (➡️)

4. **Test**:
   - Tools → Serial Monitor
   - Set baud rate: 9600
   - Should see: `25.30,68.50,120.00` (example values)

---

## Step 3: Python Backend (1 minute)

1. **Install Python packages**:
```bash
pip install Flask pyserial numpy pandas scikit-learn
```

2. **Organize files** (ensure this structure):
```
project_folder/
├── app.py
├── arduino_code.ino
├── crop_model.pkl
├── label_encoder.pkl
├── requirements.txt
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

3. **Run Flask**:
```bash
python app.py
```

---

## Step 4: Open Web Interface

1. Open browser
2. Go to: `http://localhost:5000`
3. Click "Connect Arduino" if not auto-connected
4. Watch live sensor data!

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ Arduino Serial Monitor shows: `Temperature,Humidity,Rainfall`
- ✅ Flask console shows: `Connected to Arduino on COM3`
- ✅ Web interface displays live sensor values
- ✅ Crop prediction updates automatically

---

## 🆘 Quick Troubleshooting

### Arduino Not Detected?
```bash
# Check available ports
python -c "import serial.tools.list_ports; [print(p.device) for p in serial.tools.list_ports.comports()]"
```

### DHT11 Shows NaN?
- Wait 2 seconds after powering Arduino
- Check wire to Pin 2
- Check DHT library is installed

### Model Not Found?
- Ensure `crop_model.pkl` is in same folder as `app.py`
- Check file names (case-sensitive on Linux/Mac)

### Web Page Not Loading?
- Check Flask is running (console should show "Running on http://0.0.0.0:5000")
- Try `http://127.0.0.1:5000` instead

---

## 🎯 Test Your System

### Test 1: Temperature
- Blow warm air on DHT11
- Temperature should increase in web interface

### Test 2: Humidity
- Breathe on DHT11
- Humidity should increase

### Test 3: Rainfall
- Drop water on Raindrops sensor
- Rainfall value should increase

### Test 4: Prediction
- Use Manual Prediction form
- Enter: Temp=25, Humidity=80, Rainfall=200
- Should predict: **Rice**

---

## 📊 Example Predictions

| Temperature | Humidity | Rainfall | Predicted Crop |
|-------------|----------|----------|----------------|
| 25°C        | 80%      | 200mm    | Rice           |
| 30°C        | 60%      | 50mm     | Cotton         |
| 20°C        | 65%      | 100mm    | Wheat          |
| 28°C        | 70%      | 150mm    | Maize          |

---

## 🚀 Next Steps

1. ✅ Hardware working? → Read full README.md
2. ✅ Want to customize? → Edit templates/index.html
3. ✅ Need more accuracy? → Train model with your local data
4. ✅ Deploy remotely? → Use Raspberry Pi or cloud server

---

## 📞 Support Resources

- **Full Documentation**: README.md
- **Hardware Details**: HARDWARE_SETUP.md
- **Arduino Issues**: Check Serial Monitor first
- **Python Issues**: Check Flask console logs

---

**Estimated Total Setup Time**: 5-10 minutes

**Congratulations! Your IoT system is ready! 🎉**
