# IoT-Based Crop Recommendation System

## 🌾 Project Overview
A complete IoT system that uses **Arduino Uno R3** with sensors to collect real-time environmental data, applies **Machine Learning** (Random Forest) to predict suitable crops, and displays recommendations on a **Flask web interface**.

## 🔧 Hardware Components
- **Arduino Uno R3**
- **DHT11** Temperature & Humidity Sensor
- **Soil Moisture Sensor** (Analog)
- Breadboard and Jumper Wires
- USB Cable (for Arduino-PC connection)

## 📊 System Architecture
```
Arduino (Sensors) → Serial (USB) → Python (Flask + ML) → Web Interface
```

## 🔌 Hardware Connections

### DHT11 Temperature & Humidity Sensor
- **VCC** → Arduino **5V**
- **GND** → Arduino **GND**
- **DATA** → Arduino **Digital Pin 2**

### Soil Moisture Sensor
- **VCC** → Arduino **5V**
- **GND** → Arduino **GND**
- **A0** → Arduino **Analog Pin A0**

## 💻 Software Setup

### 1️⃣ Arduino Setup

1. **Install Arduino IDE** (https://www.arduino.cc/en/software)

2. **Install DHT Library**:
   - Open Arduino IDE
   - Go to: Sketch → Include Library → Manage Libraries
   - Search for "DHT sensor library" by Adafruit
   - Install "DHT sensor library" and "Adafruit Unified Sensor"

3. **Upload Arduino Code**:
   - Open `hardware/arduino_code.ino` in Arduino IDE
   - Select Board: Tools → Board → Arduino Uno
   - Select Port: Tools → Port → (Select your Arduino port)
   - Click Upload (➡️ button)

4. **Verify Serial Output**:
   - Open Serial Monitor (Tools → Serial Monitor)
   - Set baud rate to **9600**
   - You should see: `Temperature,Humidity,SoilMoisture` data every 3 seconds

### 2️⃣ Python Setup

1. **Install Python 3.8+** (https://www.python.org/downloads/)

2. **Install Dependencies**:
   ```bash
   cd Crop_Recommendation_System
   pip install -r requirements.txt
   ```

3. **Train ML Model**:
   ```bash
   python model/train_model.py
   ```
   
   This will:
   - Load the crop dataset
   - Train Random Forest model
   - Save model as `crop_model.pkl`
   - Display accuracy metrics

4. **Run Flask Backend**:
   ```bash
   python backend/app.py
   ```
   
   The server will:
   - Automatically detect Arduino port
   - Start reading sensor data
   - Launch web server at `http://localhost:5000`

## 🌐 Using the Web Interface

1. **Open Browser**: Navigate to `http://localhost:5000`

2. **Features**:
   - **Live Sensor Data**: Real-time Temperature, Humidity, Soil Moisture
   - **Crop Recommendation**: AI-powered crop prediction
   - **Manual Testing**: Test predictions with custom values
   - **Connection Status**: Arduino connection indicator

3. **If Arduino Not Connected**:
   - Check USB cable connection
   - Verify Arduino is powered on
   - Click "Connect Arduino" button
   - Check backend console for port detection

## 🧠 Machine Learning Details

**Algorithm**: Random Forest Classifier

**Input Features**:
- Temperature (°C) - from DHT11
- Humidity (%) - from DHT11
- Soil Moisture (%) - from Soil Sensor
- pH (default: 6.5) - can be added with pH sensor
- Rainfall (default: 120mm) - can be integrated with weather API

**Output**: Recommended crop (e.g., Rice, Wheat, Maize, etc.)

**Dataset**: 22 crop types with 264 samples

**Crops Supported**:
- Rice, Maize, Chickpea, Kidney Beans, Pigeon Peas
- Moth Beans, Mung Bean, Black Gram, Lentil
- Pomegranate, Banana, Mango, Grapes, Watermelon
- Muskmelon, Apple, Orange, Papaya, Coconut
- Cotton, Jute, Coffee

## 📁 Project Structure
```
Crop_Recommendation_System/
├── hardware/
│   └── arduino_code.ino          # Arduino sensor code
├── dataset/
│   └── crop_data.csv              # Training dataset
├── model/
│   ├── train_model.py             # ML training script
│   ├── crop_model.pkl             # Trained model (generated)
│   └── label_encoder.pkl          # Label encoder (generated)
├── backend/
│   └── app.py                     # Flask server + serial communication
├── frontend/
│   ├── templates/
│   │   └── index.html             # Web interface
│   └── static/
│       ├── style.css              # Styling
│       └── script.js              # Frontend logic
├── requirements.txt               # Python dependencies
└── README.md                      # This file
```

## 🔍 Troubleshooting

### Arduino Not Detected
- **Windows**: Install CH340 driver (for clone Arduinos)
- **Linux**: Add user to dialout group: `sudo usermod -a -G dialout $USER`
- **Mac**: Install FTDI or CH340 driver
- Check Device Manager/System Info for port name

### Serial Port Permission Error (Linux)
```bash
sudo chmod 666 /dev/ttyUSB0  # or ttyACM0
```

### Model Not Found Error
- Run: `python model/train_model.py` before starting backend

### Sensor Reading Error
- Check wiring connections
- Verify DHT11 library is installed
- Check sensor orientation (DHT11 has correct pin order)

### Web Interface Not Loading
- Ensure Flask is running
- Check firewall settings
- Try `http://127.0.0.1:5000` instead of localhost

## 📊 Sample Output

**Serial Monitor (Arduino)**:
```
Arduino Ready - Crop Recommendation System
25.30,68.50,45.20
26.10,70.30,47.80
```

**Backend Console**:
```
✓ Connected to Arduino on COM3
Sensor: T=25.3°C, H=68.5%, SM=45.2% -> Crop: Rice
```

**Web Interface**:
- Live sensor values updating every 3 seconds
- Crop recommendation displayed in real-time

## 🎓 Technical Specifications

**Communication**: USB Serial (9600 baud)  
**Sensor Reading Rate**: Every 3 seconds  
**ML Model Accuracy**: ~95%  
**Web Update Rate**: Every 2 seconds  
**Browser Compatibility**: Chrome, Firefox, Edge, Safari

## 🚀 Future Enhancements
- Add pH sensor for better accuracy
- Integrate weather API for real-time rainfall data
- Add NPK sensor (Nitrogen, Phosphorus, Potassium)
- Implement data logging to database
- Add crop growth monitoring
- Mobile app interface

## 📝 Project Credits
**Type**: 3rd Year Engineering Project  
**Domain**: IoT + Machine Learning  
**Hardware**:  DHT11 , ESP8266 WiFi ,Arduino Uno R3
**Software**: Python, Flask, scikit-learn  
**Frontend**: HTML5, CSS3, JavaScript

## 📜 License
This project is for educational purposes. Feel free to use and modify for your academic projects.

---

**Need Help?** Check:
1. Hardware connections are correct
2. Arduino code is uploaded successfully
3. Python dependencies are installed
4. ML model is trained (run train_model.py)
5. Flask server is running

**For Serial Issues**: Disconnect and reconnect Arduino, restart Flask server.

🌾 Happy Farming with IoT! 🌾
