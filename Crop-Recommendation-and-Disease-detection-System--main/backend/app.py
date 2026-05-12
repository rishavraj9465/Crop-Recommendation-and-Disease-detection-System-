"""
Flask Backend for IoT Crop Recommendation System
- Reads serial data from Arduino
- Uses ML model for crop prediction
- Serves Web UI
"""

from flask import Flask, render_template, jsonify, request
import serial
import serial.tools.list_ports
import joblib
import numpy as np
import time
import threading
import os

# =====================================================
# PATH SETUP (VERY IMPORTANT)
# =====================================================
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

MODEL_PATH = os.path.join(BASE_DIR, 'model', 'crop_model.pkl')
ENCODER_PATH = os.path.join(BASE_DIR, 'model', 'label_encoder.pkl')

TEMPLATE_DIR = os.path.join(BASE_DIR, 'frontend', 'templates')
STATIC_DIR = os.path.join(BASE_DIR, 'frontend', 'static')

# =====================================================
# FLASK APP
# =====================================================
app = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)

# =====================================================
# GLOBAL VARIABLES
# =====================================================
arduino = None
is_reading = False

latest_sensor_data = {
    "temperature": 0,
    "humidity": 0,
    "rainfall": 0,
    "timestamp": time.time()
}

predicted_crop = "Waiting for data..."

# =====================================================
# LOAD ML MODEL
# =====================================================
try:
    model = joblib.load(MODEL_PATH)
    label_encoder = joblib.load(ENCODER_PATH)
    print("✅ ML Model and Label Encoder Loaded")

except FileNotFoundError:
    print("❌ Model files not found")
    model = None
    label_encoder = None

except Exception as e:
    print("❌ Model loading error:", e)
    model = None
    label_encoder = None

# =====================================================
# ARDUINO CONNECTION
# =====================================================
def find_arduino_port():
    ports = serial.tools.list_ports.comports()
    for port in ports:
        if 'Arduino' in port.description or 'USB' in port.description or 'CH340' in port.description:
            return port.device
    return None


def connect_arduino():
    global arduino
    port = find_arduino_port()

    if port is None:
        print("⚠️ Arduino not detected")
        return False

    try:
        arduino = serial.Serial(port, 9600, timeout=1)
        time.sleep(2)
        print(f"✅ Arduino connected on {port}")
        return True
    except Exception as e:
        print("❌ Arduino connection failed:", e)
        return False


# =====================================================
# SERIAL DATA READING THREAD
# =====================================================
def read_serial_data():
    global latest_sensor_data, predicted_crop, is_reading

    if arduino is None:
        return

    is_reading = True
    print("📡 Reading sensor data...")

    while is_reading:
        try:
            if arduino.in_waiting > 0:
                line = arduino.readline().decode('utf-8').strip()

                if ',' not in line:
                    continue

                values = line.split(',')
                if len(values) != 3:
                    continue

                temperature = float(values[0])
                humidity = float(values[1])
                rainfall = float(values[2])

                latest_sensor_data = {
                    "temperature": round(temperature, 2),
                    "humidity": round(humidity, 2),
                    "rainfall": round(rainfall, 2),
                    "timestamp": time.time()
                }

                if model is not None:
                    predicted_crop = predict_crop(temperature, humidity, rainfall)

                print(f"T={temperature} H={humidity} R={rainfall} → {predicted_crop}")

        except Exception as e:
            print("⚠️ Serial read error:", e)
            time.sleep(1)


# =====================================================
# ML PREDICTION
# =====================================================
def predict_crop(temp, humidity, rainfall):
    try:
        features = np.array([[temp, humidity, rainfall]])
        prediction = model.predict(features)
        crop = label_encoder.inverse_transform(prediction)[0]
        return crop.capitalize()
    except Exception as e:
        print("❌ Prediction error:", e)
        return "Prediction Error"


# =====================================================
# FLASK ROUTES
# =====================================================
@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/sensor-data')
def sensor_data():
    return jsonify({
        "success": True,
        "data": latest_sensor_data,
        "predicted_crop": predicted_crop,
        "arduino_connected": arduino is not None
    })


@app.route('/api/connect', methods=['POST'])
def api_connect():
    success = connect_arduino()
    if success and not is_reading:
        thread = threading.Thread(target=read_serial_data, daemon=True)
        thread.start()

    return jsonify({
        "success": success,
        "message": "Arduino connected" if success else "Connection failed"
    })


@app.route('/api/predict', methods=['POST'])
def manual_predict():
    data = request.json

    temp = float(data.get('temperature', 25))
    humidity = float(data.get('humidity', 70))
    rainfall = float(data.get('rainfall', 100))

    crop = predict_crop(temp, humidity, rainfall)

    return jsonify({
        "success": True,
        "predicted_crop": crop
    })


# =====================================================
# MAIN
# =====================================================
if __name__ == '__main__':
    print("\n==============================")
    print("🌾 Crop Recommendation System")
    print("==============================")

    if model is None:
        print("⚠️ ML model missing – predictions disabled")

    if connect_arduino():
        threading.Thread(target=read_serial_data, daemon=True).start()
    else:
        print("⚠️ Arduino not connected")

    print("🌐 Open: http://localhost:5000")
    app.run(debug=True, host='0.0.0.0', port=5000, use_reloader=False)
