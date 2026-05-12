# Hardware Setup Guide
## IoT Crop Recommendation System

### Components Required

1. **Arduino Uno R3** - 1 piece
2. **DHT11 Temperature & Humidity Sensor Module** - 1 piece
3. **Raindrops Detection Sensor Module** - 1 piece
4. **Breadboard** - 1 piece (optional, for clean wiring)
5. **Jumper Wires** - Male-to-Male and Male-to-Female
6. **USB Cable** - Type A to Type B (for Arduino)

---

## Detailed Wiring Connections

### DHT11 Temperature & Humidity Sensor Module

The DHT11 module typically has 3 pins:

```
DHT11 Module Pins:
┌─────────────┐
│   DHT11     │
│             │
│  -  DATA  + │
└──┬───┬───┬──┘
   │   │   │
  GND DATA VCC
```

**Connections**:
- **VCC (+ or middle pin)** → Arduino **5V**
- **DATA (middle or S pin)** → Arduino **Digital Pin 2**
- **GND (- pin)** → Arduino **GND**

---

### Raindrops Detection Sensor Module

The Raindrops module typically has 4 pins (some have 3):

```
Raindrops Sensor:
┌──────────────┐
│   Sensor     │
│   Board      │
│              │
│ GND VCC A0 D0│
└──┬───┬──┬──┬─┘
   │   │  │  │
```

**Connections** (we use analog output):
- **VCC** → Arduino **5V**
- **GND** → Arduino **GND**
- **A0** → Arduino **Analog Pin A0**
- **D0** → Not connected (we don't use digital output)

---

## Complete Wiring Diagram (Text)

```
Arduino Uno R3
┌─────────────────────────────┐
│                             │
│  Digital Pins:              │
│  ┌──────────────┐           │
│  │ 2  ←  DHT11  │           │
│  └──────────────┘           │
│                             │
│  Analog Pins:               │
│  ┌──────────────┐           │
│  │ A0 ← Raindrops│          │
│  └──────────────┘           │
│                             │
│  Power:                     │
│  ┌──────────────┐           │
│  │ 5V → Sensors │           │
│  │ GND → Sensors│           │
│  └──────────────┘           │
│                             │
│  USB ←→ Computer            │
└─────────────────────────────┘
```

---

## Step-by-Step Assembly

### Step 1: Prepare Components
- Lay out all components on a clean surface
- Identify each sensor's pins
- Prepare jumper wires (3 for DHT11, 3 for Raindrops)

### Step 2: Connect DHT11
1. Connect **DHT11 VCC** to **Arduino 5V** (red wire)
2. Connect **DHT11 GND** to **Arduino GND** (black wire)
3. Connect **DHT11 DATA** to **Arduino Digital Pin 2** (yellow/green wire)

### Step 3: Connect Raindrops Sensor
1. Connect **Raindrops VCC** to **Arduino 5V** (red wire)
2. Connect **Raindrops GND** to **Arduino GND** (black wire)
3. Connect **Raindrops A0** to **Arduino Analog Pin A0** (blue wire)

### Step 4: Connect Arduino to Computer
1. Use USB cable to connect Arduino to computer
2. Arduino should power on (LED lights up)
3. Both sensors should receive power

---

## Verification Checklist

Before uploading code, verify:

- [ ] DHT11 VCC connected to Arduino 5V
- [ ] DHT11 GND connected to Arduino GND
- [ ] DHT11 DATA connected to Arduino Pin 2
- [ ] Raindrops VCC connected to Arduino 5V
- [ ] Raindrops GND connected to Arduino GND
- [ ] Raindrops A0 connected to Arduino A0
- [ ] USB cable connected
- [ ] Arduino power LED is ON
- [ ] No loose connections
- [ ] No short circuits (VCC not touching GND)

---

## Power Considerations

### Option 1: USB Power (Recommended for Development)
- Power Arduino via USB from computer
- Sensors powered from Arduino's 5V pin
- **Advantage**: Easy debugging, can monitor serial
- **Current Draw**: ~100mA total (safe for USB)

### Option 2: External Power (For Deployment)
- Use 9V battery or wall adapter with barrel jack
- Sensors still powered from Arduino's 5V pin
- **Advantage**: Portable, no computer needed
- **Note**: Cannot view serial monitor wirelessly

---

## Common Wiring Mistakes

### ❌ Wrong Pin Numbers
- **DHT11 on wrong pin**: Code expects Pin 2
- **Raindrops on digital pin**: Must use A0 (analog)

### ❌ Reversed Polarity
- **VCC to GND**: Will damage sensor
- **Solution**: Always check red wire to 5V, black to GND

### ❌ Loose Connections
- **Intermittent readings**: Check all connections
- **Use breadboard**: For more stable connections

### ❌ Multiple Sensors on Same Pin
- Each sensor needs its own data pin
- DHT11: Digital Pin 2
- Raindrops: Analog Pin A0

---

## Testing Your Setup

### Test 1: Visual Check
- Arduino power LED should be ON
- Some sensor modules have power LEDs - these should be ON

### Test 2: Serial Monitor Test
1. Upload the Arduino code
2. Open Serial Monitor (9600 baud)
3. You should see:
   ```
   Arduino Ready - Crop Recommendation System
   25.30,68.50,120.00
   ```

### Test 3: Sensor Response
- **DHT11**: Blow warm air on sensor - temperature should increase
- **DHT11**: Breathe on sensor - humidity should increase
- **Raindrops**: Drop water on sensor - rainfall value should increase

---

## Troubleshooting

### Problem: No Serial Output
**Solutions**:
1. Check USB connection
2. Check correct port selected in Arduino IDE
3. Check baud rate is 9600
4. Verify code is uploaded

### Problem: DHT11 Shows NaN
**Solutions**:
1. Check DHT11 DATA wire to Pin 2
2. Check VCC and GND connections
3. Wait 2 seconds after power on
4. Try different DHT11 sensor (may be faulty)

### Problem: Rainfall Always 0 or Max
**Solutions**:
1. Check A0 connection
2. Verify sensor is powered (LED on)
3. Sensor board may be permanently wet/dry
4. Clean sensor board with dry cloth

### Problem: Erratic Readings
**Solutions**:
1. Check for loose wires
2. Use breadboard for stable connections
3. Keep wires away from power sources
4. Add 10kΩ pull-up resistor to DHT11 DATA pin (advanced)

---

## Safety Tips

- ⚠️ Never connect VCC directly to GND (short circuit)
- ⚠️ Disconnect power before wiring/unwiring
- ⚠️ Don't exceed 5V for sensor VCC
- ⚠️ Keep water away from Arduino board (only test on sensor)
- ⚠️ Use proper polarity (red = +, black = -)

---

## Advanced: Using Breadboard

For cleaner wiring:

```
Breadboard Layout:
┌────────────────────────────┐
│ Power Rails:               │
│ + ←─5V from Arduino        │
│ - ←─GND from Arduino       │
│                            │
│ DHT11 Connection:          │
│ + → VCC                    │
│ Data → Pin 2               │
│ - → GND                    │
│                            │
│ Raindrops Connection:      │
│ + → VCC                    │
│ A0 → Pin A0                │
│ - → GND                    │
└────────────────────────────┘
```

Benefits:
- Shared power rails (one 5V, one GND)
- More stable connections
- Easier to add more sensors later

---

## Next Steps

After completing hardware setup:

1. ✅ Install Arduino IDE
2. ✅ Install DHT library
3. ✅ Upload arduino_code.ino
4. ✅ Test with Serial Monitor
5. ✅ Run Python backend (app.py)
6. ✅ Open web interface

**Happy Building! 🔧**
