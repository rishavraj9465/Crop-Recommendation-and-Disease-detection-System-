/*
 * IoT-Based Crop Recommendation System
 * Arduino Uno R3 - Sensor Data Acquisition
 * 
 * Hardware:
 * - DHT11 Temperature & Humidity Sensor Module
 * - Raindrops Detection Sensor Module
 * 
 * Connections:
 * DHT11:
 *   VCC  -> Arduino 5V
 *   GND  -> Arduino GND
 *   DATA -> Arduino Digital Pin 2
 * 
 * Raindrops Sensor:
 *   VCC  -> Arduino 5V
 *   GND  -> Arduino GND
 *   A0   -> Arduino Analog Pin A0
 */

#include <DHT.h>

// Pin Definitions
#define DHTPIN 2          // DHT11 data pin connected to Digital Pin 2
#define DHTTYPE DHT11     // DHT sensor type
#define RAIN_SENSOR_PIN A0 // Raindrops sensor connected to Analog Pin A0

// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

// Variables
float temperature = 0.0;
float humidity = 0.0;
float rainfall = 0.0;

void setup() {
  // Initialize serial communication
  Serial.begin(9600);
  
  // Initialize DHT sensor
  dht.begin();
  
  // Wait for sensor stabilization
  delay(2000);
  
  Serial.println("Arduino Ready - Crop Recommendation System");
  Serial.println("Sensors: DHT11 + Raindrops Detection Module");
  Serial.println("Format: Temperature,Humidity,Rainfall");
  Serial.println("=========================================");
}

void loop() {
  // Read DHT11 sensor
  temperature = dht.readTemperature();  // Read temperature in Celsius
  humidity = dht.readHumidity();        // Read humidity in percentage
  
  // Read Raindrops sensor
  int rainSensorValue = analogRead(RAIN_SENSOR_PIN);
  
  // Convert rain sensor reading to rainfall estimate (0-300mm range)
  // Rain sensor gives values from 0 (wet) to 1023 (dry)
  // We invert it: 1023 = 0mm rainfall, 0 = maximum rainfall
  rainfall = map(rainSensorValue, 1023, 0, 0, 300);
  
  // Constrain rainfall to 0-300mm range
  rainfall = constrain(rainfall, 0, 300);
  
  // Check if DHT11 readings are valid
  if (isnan(temperature) || isnan(humidity)) {
    Serial.println("ERROR: Failed to read from DHT11 sensor!");
    delay(3000);
    return;
  }
  
  // Send data in CSV format: Temperature,Humidity,Rainfall
  Serial.print(temperature, 2);  // 2 decimal places
  Serial.print(",");
  Serial.print(humidity, 2);
  Serial.print(",");
  Serial.println(rainfall, 2);
  
  // Wait 3 seconds before next reading
  delay(3000);
}
