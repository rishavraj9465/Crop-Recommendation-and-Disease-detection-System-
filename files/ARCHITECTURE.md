# System Architecture & Data Flow
## IoT Crop Recommendation System

---

## 📊 Complete System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     HARDWARE LAYER                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌──────────────┐      ┌──────────────┐                       │
│  │   DHT11      │      │  Raindrops   │                       │
│  │   Sensor     │      │   Sensor     │                       │
│  └──────┬───────┘      └──────┬───────┘                       │
│         │                     │                                │
│         │                     │                                │
│         └──────────┬──────────┘                                │
│                    │                                            │
│              ┌─────▼──────┐                                    │
│              │  Arduino    │                                    │
│              │  Uno R3     │                                    │
│              └─────┬───────┘                                    │
│                    │ USB Serial (9600 baud)                     │
└────────────────────┼────────────────────────────────────────────┘
                     │
                     │
┌────────────────────▼────────────────────────────────────────────┐
│                   SOFTWARE LAYER                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │           Python Flask Backend (app.py)                   │ │
│  │                                                           │ │
│  │  ┌─────────────┐    ┌──────────────┐   ┌─────────────┐  │ │
│  │  │   Serial    │───>│  Data Parser │──>│   ML Model  │  │ │
│  │  │   Reader    │    │              │   │  Predictor  │  │ │
│  │  └─────────────┘    └──────────────┘   └─────────────┘  │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │         API Endpoints                               │ │ │
│  │  │  • /api/sensor-data                                 │ │ │
│  │  │  • /api/connect                                     │ │ │
│  │  │  • /api/predict                                     │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └───────────────────────────────────────────────────────────┘ │
│                    │                                            │
└────────────────────┼────────────────────────────────────────────┘
                     │ HTTP (localhost:5000)
                     │
┌────────────────────▼────────────────────────────────────────────┐
│                  PRESENTATION LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │          Web Browser Interface                            │ │
│  │                                                           │ │
│  │  ┌─────────────┐  ┌──────────────┐  ┌─────────────────┐ │ │
│  │  │   Sensor    │  │  Prediction  │  │    Manual       │ │ │
│  │  │   Display   │  │   Display    │  │    Testing      │ │ │
│  │  └─────────────┘  └──────────────┘  └─────────────────┘ │ │
│  │                                                           │ │
│  │  Updates every 2 seconds via JavaScript                  │ │
│  └───────────────────────────────────────────────────────────┘ │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow Diagram

```
STEP 1: Sensor Reading
━━━━━━━━━━━━━━━━━━━━━
DHT11 Sensor ─────> Measures Temperature & Humidity
                    │
                    ├─> Temperature: 25.3°C
                    └─> Humidity: 68.5%

Raindrops Sensor ─> Measures Rainfall
                    │
                    └─> Rainfall: 120.0mm


STEP 2: Arduino Processing
━━━━━━━━━━━━━━━━━━━━━━━━━
Arduino reads sensors every 3 seconds
       │
       ├─> Formats as CSV: "25.3,68.5,120.0"
       │
       └─> Sends via Serial @ 9600 baud


STEP 3: Python Backend Receives
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Flask app.py reads serial data
       │
       ├─> Parses CSV: [25.3, 68.5, 120.0]
       │
       ├─> Stores in: latest_sensor_data{}
       │
       └─> Feeds to ML model


STEP 4: ML Prediction
━━━━━━━━━━━━━━━━━━━━
Random Forest Model processes:
       │
       ├─> Input: [Temperature, Humidity, Rainfall]
       │
       ├─> Prediction: "Rice"
       │
       └─> Stores in: predicted_crop variable


STEP 5: API Response
━━━━━━━━━━━━━━━━━━━
Flask serves JSON via /api/sensor-data:
       │
       └─> {
             "temperature": 25.3,
             "humidity": 68.5,
             "rainfall": 120.0,
             "predicted_crop": "Rice"
           }


STEP 6: Frontend Display
━━━━━━━━━━━━━━━━━━━━━━━
JavaScript fetches API every 2 seconds
       │
       ├─> Updates sensor values in UI
       │
       └─> Displays predicted crop
```

---

## 🔌 Communication Protocol

### Serial Communication (Arduino → Python)

```
Format: CSV (Comma Separated Values)
Baud Rate: 9600
Update Rate: 3 seconds

Example Data Stream:
━━━━━━━━━━━━━━━━━━━━
25.30,68.50,120.00
26.10,70.30,115.50
24.80,69.20,122.30
...

Parsing in Python:
━━━━━━━━━━━━━━━━━
line = "25.30,68.50,120.00"
parts = line.split(',')

temperature = float(parts[0])  # 25.30
humidity = float(parts[1])     # 68.50
rainfall = float(parts[2])     # 120.00
```

---

### HTTP Communication (Backend → Frontend)

```
Protocol: HTTP/1.1
Port: 5000
Content-Type: application/json

API Endpoints:
━━━━━━━━━━━━━

1. GET /api/sensor-data
   Response:
   {
     "success": true,
     "data": {
       "temperature": 25.3,
       "humidity": 68.5,
       "rainfall": 120.0,
       "timestamp": 1707589234
     },
     "predicted_crop": "Rice",
     "connected": true
   }

2. POST /api/connect
   Response:
   {
     "success": true,
     "message": "Connected to Arduino"
   }

3. POST /api/predict
   Request:
   {
     "temperature": 25,
     "humidity": 70,
     "rainfall": 100
   }
   
   Response:
   {
     "success": true,
     "predicted_crop": "Rice"
   }
```

---

## 🧠 Machine Learning Pipeline

```
┌───────────────────────────────────────────────────────────┐
│                    TRAINING PHASE                         │
│                   (Done in Jupyter)                       │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Dataset (4400 samples, 22 crops)                        │
│         │                                                 │
│         ├─> Features: [Temperature, Humidity, Rainfall]  │
│         └─> Labels: [Rice, Wheat, Cotton, ...]           │
│                                                           │
│  ┌──────────────────────────────────────┐                │
│  │   Random Forest Classifier           │                │
│  │   • n_estimators = 100               │                │
│  │   • max_depth = auto                 │                │
│  │   • Accuracy: ~99%                   │                │
│  └──────────────────────────────────────┘                │
│         │                                                 │
│         ├─> Save model: crop_model.pkl                   │
│         └─> Save encoder: label_encoder.pkl              │
│                                                           │
└───────────────────────────────────────────────────────────┘
                         │
                         │ (Models saved to disk)
                         │
┌────────────────────────▼──────────────────────────────────┐
│                   PREDICTION PHASE                        │
│                  (Real-time in Flask)                     │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Load models:                                             │
│    model = pickle.load('crop_model.pkl')                 │
│    encoder = pickle.load('label_encoder.pkl')            │
│                                                           │
│  Sensor data: [25.3, 68.5, 120.0]                       │
│         │                                                 │
│         ├─> Reshape: [[25.3, 68.5, 120.0]]              │
│         │                                                 │
│         ├─> model.predict(features)                      │
│         │                                                 │
│         ├─> Returns: [11] (encoded label)                │
│         │                                                 │
│         └─> encoder.inverse_transform([11])              │
│                 │                                         │
│                 └─> "Rice"                               │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

---

## ⚡ Performance Metrics

### Arduino Processing:
- **Sensor Read Time**: ~250ms per sensor
- **Total Loop Time**: ~500ms + 3000ms delay = 3.5s
- **Data Rate**: ~0.3 readings/second
- **Serial Baud**: 9600 bits/second

### Python Backend:
- **Serial Read**: Continuous (async thread)
- **ML Prediction**: <10ms per prediction
- **API Response**: <50ms average
- **Memory Usage**: ~50MB (with ML models loaded)

### Frontend:
- **Polling Rate**: Every 2 seconds
- **API Call Time**: ~100ms
- **UI Update**: <5ms
- **Total Latency**: Sensor → UI = ~3-5 seconds

---

## 🎯 Feature Mapping

```
┌─────────────────────────────────────────────────────┐
│         FROM SENSORS TO ML MODEL                    │
└─────────────────────────────────────────────────────┘

DHT11 Sensor Reading          ML Model Feature
━━━━━━━━━━━━━━━━━━━━         ━━━━━━━━━━━━━━━━
Temperature: 25.3°C    ──────> temperature: 25.3
Humidity: 68.5%        ──────> humidity: 68.5

Raindrops Sensor Reading
━━━━━━━━━━━━━━━━━━━━━━
Analog Value: 512      ──────> rainfall: 120.0mm
(mapped from 0-1023)            (inverted & scaled)


Final Feature Vector:
━━━━━━━━━━━━━━━━━━━
[[25.3, 68.5, 120.0]]

        │
        ▼
Random Forest Model
        │
        ▼
Prediction: "Rice"
```

---

## 🔐 Error Handling Flow

```
LEVEL 1: Hardware Errors
━━━━━━━━━━━━━━━━━━━━━━
DHT11 fails ──────> Arduino: "ERROR: Failed to read from DHT11"
                    │
                    └──> Skip this reading, try again in 3s

Raindrops disconnected ──> Reads 0 or max value
                            │
                            └──> Shows in UI, but prediction may be off


LEVEL 2: Communication Errors
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Serial port blocked ──> Python: "Failed to connect"
                        │
                        └──> Show "Disconnected" in web UI

Bad data format ───────> Python: Skip parsing, wait for next valid line


LEVEL 3: ML Errors
━━━━━━━━━━━━━━━━━
Model not found ──────> Python: prediction = "Error in prediction"
                        │
                        └──> Show error in UI

Invalid input ─────────> Catch exception, return "Error"


LEVEL 4: Frontend Errors
━━━━━━━━━━━━━━━━━━━━━━━
API timeout ───────────> Show previous values
                         │
                         └──> Console: "Error fetching sensor data"

Network error ─────────> Notification: "Connection error"
```

---

## 📈 Scalability Considerations

### Current Capacity:
- **1 Arduino** → 1 location
- **2 Sensors** → 3 data points
- **1 Flask Instance** → ~100 concurrent users
- **No Database** → No historical data

### Scaling Options:

```
OPTION 1: Multiple Locations
━━━━━━━━━━━━━━━━━━━━━━━━━
Arduino 1 (Field A) ─┐
Arduino 2 (Field B) ─┼─> Raspberry Pi → Cloud
Arduino 3 (Field C) ─┘

OPTION 2: More Sensors
━━━━━━━━━━━━━━━━━━━━
+ pH Sensor (A1)
+ NPK Sensor (A2)
+ Light Sensor (A3)
→ More accurate predictions

OPTION 3: Data Logging
━━━━━━━━━━━━━━━━━━━
Flask → SQLite/MySQL
     └─> Store: timestamp, temp, humidity, rainfall, crop
         └─> Enable: trends, analytics, history

OPTION 4: Cloud Deployment
━━━━━━━━━━━━━━━━━━━━━━━
Local Arduino → Internet → Cloud Server (AWS/Azure)
                              └─> Accessible globally
```

---

## 🎨 Technology Stack Summary

```
┌─────────────────────────────────────────────────────┐
│                  FULL STACK                         │
├─────────────────────────────────────────────────────┤
│                                                     │
│  HARDWARE                                           │
│  ├─ Arduino Uno R3 (ATmega328P)                    │
│  ├─ DHT11 (Digital Temperature & Humidity)         │
│  └─ Raindrops Detection Module (Analog)            │
│                                                     │
│  FIRMWARE                                           │
│  ├─ Arduino C++ (Wiring)                           │
│  └─ DHT Sensor Library (Adafruit)                  │
│                                                     │
│  BACKEND                                            │
│  ├─ Python 3.8+                                    │
│  ├─ Flask (Web Framework)                          │
│  ├─ PySerial (Serial Communication)                │
│  ├─ NumPy (Array Processing)                       │
│  └─ scikit-learn (Machine Learning)                │
│                                                     │
│  MACHINE LEARNING                                   │
│  ├─ Random Forest Classifier                       │
│  ├─ Pandas (Data Processing)                       │
│  └─ Pickle (Model Serialization)                   │
│                                                     │
│  FRONTEND                                           │
│  ├─ HTML5 (Structure)                              │
│  ├─ CSS3 (Styling + Animations)                    │
│  └─ JavaScript ES6 (Interactivity)                 │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

This architecture provides a complete end-to-end IoT system with real-time sensor monitoring, machine learning predictions, and an interactive web interface!
