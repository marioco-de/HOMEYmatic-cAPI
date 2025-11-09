# Homematic IP Connect API Dokumentation

Diese Dokumentation beschreibt die Integration der Homematic IP Connect API in diese Homey-App.

## 📡 API-Übersicht

Die Homematic IP Connect API bietet zwei Hauptschnittstellen:

1. **REST API**: HTTP-basierte API für Befehle und Abfragen
2. **WebSocket API**: Echtzeit-Updates über WebSocket-Verbindung

## 🔐 Authentifizierung

### HTTP Header

Jede REST-API-Anfrage benötigt folgende Header:

```javascript
{
  "Content-Type": "application/json",
  "Authorization": "Bearer YOUR_AUTH_TOKEN",
  "X-Access-Point-Id": "YOUR_ACCESS_POINT_ID"
}
```

Optional:
```javascript
{
  "X-Client-Auth-Token": "YOUR_CLIENT_AUTH_TOKEN"
}
```

## 🌐 REST API Endpunkte

### Base URL

```
https://api.homematic.com/v1
```

### Home-Informationen abrufen

**Endpoint:** `GET /home`

**Response:**
```json
{
  "home": {
    "id": "00000000-0000-0000-0000-000000000000",
    "label": "Mein Zuhause",
    "weatherSensorPresent": true,
    "location": {
      "city": "Hamburg",
      "latitude": 53.551,
      "longitude": 9.993
    }
  }
}
```

### Alle Geräte abrufen

**Endpoint:** `GET /devices`

**Response:**
```json
{
  "devices": [
    {
      "id": "3014F711A0000000000000001",
      "type": "HmIP-PSM",
      "label": "Steckdose Wohnzimmer",
      "lastStatusUpdate": 1234567890000,
      "channels": [
        {
          "id": "1",
          "functionalChannelType": "SWITCH_CHANNEL",
          "on": true,
          "energyCounter": 123.45
        }
      ]
    }
  ]
}
```

### Einzelnes Gerät abrufen

**Endpoint:** `GET /devices/{deviceId}`

**Parameter:**
- `deviceId` (string): Die Geräte-ID

**Response:**
```json
{
  "id": "3014F711A0000000000000001",
  "type": "HmIP-PSM",
  "label": "Steckdose Wohnzimmer",
  "channels": [...]
}
```

### Gerätezustand setzen

**Endpoint:** `PUT /devices/{deviceId}/channels/{channelId}/state`

**Parameter:**
- `deviceId` (string): Die Geräte-ID
- `channelId` (string): Die Kanal-ID (meist "1")

**Request Body (Switch):**
```json
{
  "on": true
}
```

**Request Body (Dimmer):**
```json
{
  "on": true,
  "dimLevel": 0.5
}
```

**Request Body (Thermostat):**
```json
{
  "setPointTemperature": 21.0
}
```

## 🔌 WebSocket API

### Verbindung herstellen

**URL:**
```
wss://api.homematic.com/v1/ws?accessPointId=YOUR_AP_ID&authToken=YOUR_TOKEN
```

### Nachrichten-Format

#### Device Update
```json
{
  "type": "device",
  "data": {
    "id": "3014F711A0000000000000001",
    "channels": [
      {
        "id": "1",
        "on": true
      }
    ]
  }
}
```

#### Group Update
```json
{
  "type": "group",
  "data": {
    "id": "00000000-0000-0000-0000-000000000001",
    "label": "Erdgeschoss",
    "channels": [...]
  }
}
```

#### Event
```json
{
  "type": "event",
  "data": {
    "eventType": "DEVICE_CHANGED",
    "deviceId": "3014F711A0000000000000001"
  }
}
```

## 📊 Gerätetypen und Channels

### Switch (Schalter)

**Typen:**
- `HmIP-PS`, `HmIP-PSM` (Steckdose)
- `HmIP-BSM` (Schaltaktor Markenschalter)
- `HmIP-FSM`, `HmIP-FSM16` (Schaltaktor Hutschiene)

**Channel Type:** `SWITCH_CHANNEL`

**Properties:**
```json
{
  "on": true,
  "energyCounter": 123.45,
  "currentPowerConsumption": 15.5
}
```

### Dimmer

**Typen:**
- `HmIP-BDT` (Dimmaktor Markenschalter)
- `HmIP-FDT` (Dimmaktor Hutschiene)

**Channel Type:** `DIMMER_CHANNEL`

**Properties:**
```json
{
  "on": true,
  "dimLevel": 0.75
}
```

### Thermostat

**Typen:**
- `HmIP-eTRV`, `HmIP-eTRV-2` (Heizkörperthermostat)
- `HmIP-BWTH`, `HmIP-WTH` (Wandthermostat)

**Channel Types:**
- `HEATING_THERMOSTAT_CHANNEL`
- `WALL_MOUNTED_THERMOSTAT_CHANNEL`

**Properties:**
```json
{
  "setPointTemperature": 21.0,
  "actualTemperature": 20.5,
  "humidity": 55,
  "valvePosition": 0.45
}
```

### Sensor

**Typen:**
- `HmIP-STH`, `HmIP-STHD` (Temperatur-/Luftfeuchtesensor)
- `HmIP-STHO` (Außensensor)

**Channel Type:** `CLIMATE_SENSOR_CHANNEL`

**Properties:**
```json
{
  "temperature": 22.5,
  "humidity": 60,
  "lowBat": false
}
```

## 🛠️ Implementation in der App

### API-Client Initialisierung

```typescript
import { HomematicConnectAPI } from './lib/HomematicConnectAPI';

const api = new HomematicConnectAPI(
  accessPointId,
  authToken,
  clientAuthToken
);

await api.connect();
```

### Geräte abrufen

```typescript
const devices = await api.getDevices();
```

### Gerät steuern

```typescript
// Schalter ein
await api.turnOn(deviceId, channelId);

// Dimmer auf 50%
await api.setDimLevel(deviceId, channelId, 0.5);

// Thermostat auf 21°C
await api.setTemperature(deviceId, channelId, 21.0);
```

### Echtzeit-Updates

```typescript
api.on('device_update', (deviceData) => {
  console.log('Gerät aktualisiert:', deviceData);
});

api.on('event', (eventData) => {
  console.log('Event empfangen:', eventData);
});
```

## 🔄 Fehlerbehandlung

### HTTP-Fehler

| Status Code | Bedeutung | Lösung |
|------------|-----------|---------|
| 400 | Bad Request | Request-Parameter überprüfen |
| 401 | Unauthorized | Auth Token überprüfen |
| 403 | Forbidden | API-Berechtigungen überprüfen |
| 404 | Not Found | Geräte-ID überprüfen |
| 429 | Too Many Requests | Rate Limit - warten und wiederholen |
| 500 | Server Error | API-Status überprüfen |

### WebSocket-Fehler

```typescript
ws.on('error', (error) => {
  console.error('WebSocket-Fehler:', error);
  // Automatischer Reconnect nach 5 Sekunden
});

ws.on('close', () => {
  console.log('WebSocket geschlossen');
  // Neuverbindung herstellen
});
```

## ⚡ Rate Limits

Die API hat folgende Rate Limits:

- **REST API:** 100 Anfragen pro Minute
- **WebSocket:** Keine Limits für empfangene Nachrichten

Bei Überschreitung: HTTP 429 → Exponentielles Backoff verwenden

## 🔒 Sicherheit

### Best Practices

1. **Tokens sicher speichern:**
   ```typescript
   homey.settings.set('authToken', token);
   ```

2. **HTTPS verwenden:**
   - Alle API-Anfragen über HTTPS
   - WebSocket über WSS

3. **Token nicht loggen:**
   ```typescript
   // ❌ Falsch
   console.log('Token:', authToken);
   
   // ✅ Richtig
   console.log('Token: ***');
   ```

## 📚 Weitere Ressourcen

- [Offizielle API-Dokumentation](https://developer.homematic-ip.com/docs)
- [API-Status](https://status.homematic-ip.com/)
- [Developer Portal](https://developer.homematic-ip.com/)

