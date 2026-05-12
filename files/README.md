# IoT-Based Crop Recommendation System

## 🌾 Project Overview
A complete IoT system that uses **Arduino Uno R3** with sensors to collect real-time environmental data, applies **Machine Learning** (Random Forest) to predict suitable crops, and displays recommendations on a **Flask web interface**.

## 🔧 Hardware Components
- **Arduino Uno R3**
- **DHT11** Temperature & Humidity Sensor Module
- **Raindrops Detection Sensor Module** (Analog)
- Breadboard and Jumper Wires
- USB Cable (for Arduino-PC connection)

## 📊 System Architecture
```
Arduino (DHT11 + Raindrops) → Serial (USB) → Python (Flask + ML) → Web Interface
```

## 📌 Hardware Connections

### DHT11 Temperature & Humidity Sensor Module
- **VCC** → Arduino **5V**
- **GND** → Arduino **GND**
- **DATA** → Arduino **Digital Pin 2**

### Raindrops Detection Sensor Module
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
   - Open `arduino_code.ino` in Arduino IDE
   - Select Board: Tools → Board → Arduino Uno
   - Select Port: Tools → Port → (Select your Arduino port)
   - Click Upload (➡️ button)

4. **Verify Serial Output**:
   - Open Serial Monitor (Tools → Serial Monitor)
   - Set baud rate to **9600**
   - You should see: `Temperature,Humidity,Rainfall` data every 3 seconds

### 2️⃣ Python Setup

1. **Install Python 3.8+** (https://www.python.org/downloads/)

2. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Prepare ML Model Files**:
   - Ensure `crop_model.pkl` is in the project directory
   - Ensure `label_encoder.pkl` is in the project directory
   - These files should be generated from your Jupyter notebook training

4. **Create Folder Structure**:
   ```
   project/
   ├── app.py
   ├── crop_model.pkl
   ├── label_encoder.pkl
   ├── requirements.txt
   ├── templates/
   │   └── index.html
   └── static/
       ├── style.css
       └── script.js
   ```

5. **Run Flask Backend**:
   ```bash
   python app.py
   ```
   
   The server will:
   - Automatically detect Arduino port
   - Start reading sensor data
   - Launch web server at `http://localhost:5000`

## 🌐 Using the Web Interface

1. **Open Browser**: Navigate to `http://localhost:5000`

2. **Features**:
   - **Live Sensor Data**: Real-time Temperature, Humidity, Rainfall
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
- **Temperature (°C)** - from DHT11
- **Humidity (%)** - from DHT11
- **Rainfall (mm)** - from Raindrops Detection Sensor

**Output**: Recommended crop (e.g., Rice, Wheat, Maize, etc.)

**Dataset**: 22 crop types with 4400 samples

**Crops Supported**:
- Rice, Maize, Chickpea, Kidney Beans, Pigeon Peas
- Moth Beans, Mung Bean, Black Gram, Lentil
- Pomegranate, Banana, Mango, Grapes, Watermelon
- Muskmelon, Apple, Orange, Papaya, Coconut
- Cotton, Jute, Coffee

## 📁 Project Structure
```
Crop_Recommendation_System/
├── arduino_code.ino               # Arduino sensor code
├── app.py                         # Flask server + serial communication
├── crop_model.pkl                 # Trained ML model
├── label_encoder.pkl              # Label encoder
├── requirements.txt               # Python dependencies
├── templates/
│   └── index.html                 # Web interface
├── static/
│   ├── style.css                  # Styling
│   └── script.js                  # Frontend logic
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
- Ensure `crop_model.pkl` and `label_encoder.pkl` are in the same directory as `app.py`
- If missing, retrain the model using your Jupyter notebook

### Sensor Reading Error
- Check wiring connections
- Verify DHT11 library is installed
- Check sensor orientation (DHT11 has correct pin order)
- For Raindrops sensor, ensure it's connected to A0

### DHT11 Returns NaN
- Check if sensor is properly connected
- Ensure 2-second delay before first reading
- Try different digital pin if pin 2 doesn't work

### Raindrops Sensor Always Shows 0 or Max
- Check analog pin connection (must be A0-A5)
- Verify sensor module is powered (LED should light up)
- Test sensor with water droplets

### Web Interface Not Loading
- Ensure Flask is running
- Check firewall settings
- Try `http://127.0.0.1:5000` instead of localhost
- Verify templates and static folders exist

## 📊 Sample Output

**Serial Monitor (Arduino)**:
```
Arduino Ready - Crop Recommendation System
Sensors: DHT11 + Raindrops Detection Module
Format: Temperature,Humidity,Rainfall
=========================================
25.30,68.50,120.00
26.10,70.30,115.50
```

**Backend Console**:
```
✅ ML model loaded successfully
✅ Connected to Arduino on COM3
Sensor: T=25.3°C, H=68.5%, Rain=120.0mm -> Crop: Rice
```

**Web Interface**:
- Live sensor values updating every 3 seconds
- Crop recommendation displayed in real-time

## 🎓 Technical Specifications

**Communication**: USB Serial (9600 baud)  
**Sensor Reading Rate**: Every 3 seconds  
**ML Model Accuracy**: ~99%  
**Web Update Rate**: Every 2 seconds  
**Browser Compatibility**: Chrome, Firefox, Edge, Safari  

**Sensor Specifications**:
- DHT11 Temperature Range: 0-50°C (±2°C accuracy)
- DHT11 Humidity Range: 20-90% (±5% accuracy)
- Raindrops Sensor: Analog output (0-1023)

## 🚀 Future Enhancements
- Add real-time weather API integration for accurate rainfall data
- Implement soil pH sensor for better accuracy
- Add NPK sensor (Nitrogen, Phosphorus, Potassium)
- Implement data logging to database (SQLite/MySQL)
- Add historical data visualization and trends
- Create mobile app interface (React Native/Flutter)
- Add multiple location support with GPS module

## 📝 How Rainfall Sensor Works

The Raindrops Detection Sensor module:
- Detects water droplets on its surface
- Outputs analog value (0-1023)
- **Dry conditions**: High value (~1023)
- **Wet conditions**: Low value (~0)

In the code:
```cpp
// Invert and map to 0-300mm range
rainfall = map(rainSensorValue, 1023, 0, 0, 300);
```

**Note**: This gives an estimate. For production systems, integrate with weather APIs for accurate rainfall data.

## 🎯 Project Credits
**Type**: Final Year Engineering Project  
**Domain**: IoT + Machine Learning  
**Hardware**: Arduino Uno R3  
**Sensors**: DHT11, Raindrops Detection Module  
**Software**: Python, Flask, scikit-learn  
**Frontend**: HTML5, CSS3, JavaScript  
**ML Model**: Random Forest with 99% accuracy

## 📜 License
This project is for educational purposes. Feel free to use and modify for your academic projects.

---

## 🆘 Need Help?

**Checklist**:
1. ✅ Hardware connections are correct
2. ✅ Arduino code is uploaded successfully
3. ✅ DHT library is installed in Arduino IDE
4. ✅ Python dependencies are installed (`pip install -r requirements.txt`)
5. ✅ ML model files (`crop_model.pkl`, `label_encoder.pkl`) are present
6. ✅ Flask server is running
7. ✅ Templates and static folders exist with correct files

**For Serial Issues**: 
- Disconnect and reconnect Arduino
- Close Serial Monitor before running Flask
- Restart Flask server
- Check if other programs are using the serial port

**For Sensor Issues**:
- DHT11: Wait 2 seconds after power on
- Raindrops: Ensure sensor board is dry for testing, wet for detection

🌾 Happy Farming with IoT! 🌾
