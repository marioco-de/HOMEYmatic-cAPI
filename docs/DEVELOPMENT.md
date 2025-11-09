# Entwickler-Dokumentation

Dokumentation für Entwickler, die an dieser App arbeiten oder sie erweitern möchten.

## 🏗️ Architektur

### Übersicht

```
┌─────────────────────────────────────────┐
│           Homey Platform                │
│  ┌───────────────────────────────────┐  │
│  │      HomematicApp (app.ts)        │  │
│  │  - App-Lifecycle                  │  │
│  │  - API-Verwaltung                 │  │
│  │  - Flow-Karten                    │  │
│  └──────────────┬────────────────────┘  │
│                 │                        │
│  ┌──────────────▼────────────────────┐  │
│  │  HomematicConnectAPI              │  │
│  │  - REST API Client                │  │
│  │  - WebSocket Handler              │  │
│  │  - Event Emitter                  │  │
│  └──────────────┬────────────────────┘  │
│                 │                        │
│  ┌──────────────▼────────────────────┐  │
│  │       Device Drivers              │  │
│  │  - Switch Driver/Device           │  │
│  │  - Dimmer Driver/Device           │  │
│  │  - Thermostat Driver/Device       │  │
│  │  - Sensor Driver/Device           │  │
│  └───────────────────────────────────┘  │
└─────────────────────────────────────────┘
          │                     │
          ▼                     ▼
    REST API              WebSocket API
  (Befehle/Abfragen)    (Echtzeit-Updates)
```

### Komponenten

#### 1. HomematicApp (src/app.ts)

Hauptklasse der App, verwaltet:
- API-Client-Initialisierung
- Flow-Karten-Registrierung
- App-Lifecycle-Events
- Globale Einstellungen

**Wichtige Methoden:**
```typescript
onInit(): Promise<void>           // App-Start
getAPI(): HomematicConnectAPI     // API-Client abrufen
updateAPIConfig(): Promise<void>  // Konfiguration aktualisieren
onUninit(): Promise<void>         // App-Ende
```

#### 2. HomematicConnectAPI (src/lib/HomematicConnectAPI.ts)

REST- und WebSocket-Client für die Homematic IP Connect API.

**Features:**
- Axios-basierter HTTP-Client
- WebSocket-Verbindung mit Auto-Reconnect
- Event Emitter für Device-Updates
- Fehlerbehandlung und Logging

**Wichtige Methoden:**
```typescript
connect(): Promise<void>                           // Verbindung herstellen
getDevices(): Promise<any[]>                       // Alle Geräte abrufen
setDeviceState(id, channel, state): Promise<void>  // Zustand setzen
disconnect(): Promise<void>                        // Verbindung trennen
```

**Events:**
```typescript
api.on('device_update', (data) => { });  // Gerät aktualisiert
api.on('group_update', (data) => { });   // Gruppe aktualisiert
api.on('event', (data) => { });          // Allgemeines Event
```

#### 3. HomematicDevice (src/lib/HomematicDevice.ts)

Basis-Klasse für alle Geräte.

**Features:**
- Automatisches Update-Polling (Fallback)
- WebSocket-Event-Handling
- Capability-Management
- Lifecycle-Management

**Zu überschreibende Methoden:**
```typescript
registerCapabilityListeners(): void       // Capabilities registrieren
updateFromDeviceData(data: any): void     // State aktualisieren
```

#### 4. Driver-Klassen

Jeder Driver verwaltet einen Gerätetyp:

**Switch Driver:**
- Erkennt Schaltgeräte (HmIP-PS, HmIP-BSM, etc.)
- Listet verfügbare Geräte beim Pairing

**Dimmer Driver:**
- Erkennt Dimmer (HmIP-BDT, HmIP-FDT)
- Unterstützt Helligkeitssteuerung

**Thermostat Driver:**
- Erkennt Thermostate (HmIP-eTRV, HmIP-WTH)
- Temperatur- und Feuchtigkeitsmessung

**Sensor Driver:**
- Erkennt Sensoren (HmIP-STH, HmIP-SMI)
- Nur lesende Capabilities

## 🔧 Development Setup

### 1. Umgebung vorbereiten

```bash
# Node.js installieren (>= 18)
nvm install 18
nvm use 18

# Homey CLI installieren
npm install -g homey

# Repository klonen
git clone https://github.com/marioco-de/HOMEYmatic-cAPI.git
cd HOMEYmatic-cAPI

# Dependencies installieren
npm install
```

### 2. TypeScript konfigurieren

Die TypeScript-Konfiguration ist in `tsconfig.json` definiert:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "strict": true,
    "outDir": "./build"
  }
}
```

### 3. Entwicklungszyklus

```bash
# 1. Code ändern in src/
vim src/app.ts

# 2. TypeScript kompilieren
npm run build

# 3. App auf Homey installieren
npm run install-app

# 4. Logs ansehen
homey app log
```

**Tipp:** Im Watch-Modus arbeiten:
```bash
# Terminal 1: Auto-Kompilierung
npm run watch

# Terminal 2: App ausführen
npm run dev
```

## 📝 Neuen Gerätetyp hinzufügen

### Schritt 1: Driver erstellen

Erstelle `src/drivers/hmip-newdevice/`:

```typescript
// driver.ts
import Homey from 'homey';

class NewDeviceDriver extends Homey.Driver {
  async onInit() {
    this.log('New Device Driver initialized');
  }

  async onPairListDevices() {
    const api = this.homey.app.getAPI();
    const devices = await api.getDevices();
    
    return devices
      .filter(device => this.isNewDevice(device))
      .map(device => ({
        name: device.label,
        data: { id: device.id, channelId: '1' }
      }));
  }

  private isNewDevice(device: any): boolean {
    return device.type?.includes('HmIP-NEW');
  }
}

module.exports = NewDeviceDriver;
```

```typescript
// device.ts
import { HomematicDevice } from '../../lib/HomematicDevice';

class NewDeviceDevice extends HomematicDevice {
  protected registerCapabilityListeners() {
    this.registerCapabilityListener('onoff', async (value) => {
      // Implementierung
    });
  }

  protected updateFromDeviceData(data: any) {
    // State-Update-Logik
  }
}

module.exports = NewDeviceDevice;
```

### Schritt 2: Wrapper erstellen

```javascript
// drivers/hmip-newdevice/driver.js
module.exports = require('../../build/drivers/hmip-newdevice/driver.js');

// drivers/hmip-newdevice/device.js
module.exports = require('../../build/drivers/hmip-newdevice/device.js');
```

### Schritt 3: In app.json registrieren

```json
{
  "drivers": [
    {
      "id": "hmip-newdevice",
      "name": { "de": "Neues Gerät", "en": "New Device" },
      "class": "socket",
      "capabilities": ["onoff"],
      "pair": [
        {
          "id": "list_devices",
          "template": "list_devices"
        }
      ]
    }
  ]
}
```

### Schritt 4: Kompilieren und testen

```bash
npm run build
npm run install-app
```

## 🎨 Capabilities erweitern

### Eigene Capability hinzufügen

In `app.json`:

```json
{
  "capabilities": {
    "valve_position": {
      "type": "number",
      "title": {
        "de": "Ventilposition",
        "en": "Valve Position"
      },
      "min": 0,
      "max": 1,
      "step": 0.01,
      "units": {
        "de": "%",
        "en": "%"
      },
      "getable": true,
      "setable": false
    }
  }
}
```

Im Device:

```typescript
this.addCapability('valve_position');
this.setCapabilityValue('valve_position', 0.45);
```

## 🔌 API erweitern

### Neue API-Methode

In `HomematicConnectAPI.ts`:

```typescript
/**
 * Ruft Gruppen-Informationen ab
 */
async getGroup(groupId: string): Promise<any> {
  try {
    const response = await this.httpClient.get(`/groups/${groupId}`);
    return response.data;
  } catch (error) {
    this.errorLogger(`Fehler beim Abrufen der Gruppe ${groupId}:`, error);
    throw error;
  }
}
```

### WebSocket-Event hinzufügen

```typescript
private handleWebSocketMessage(message: any): void {
  if (message.type === 'new_event_type') {
    this.emit('new_event_type', message.data);
  }
}
```

Im Device lauschen:

```typescript
this.api.on('new_event_type', (data) => {
  this.log('Neues Event:', data);
});
```

## 🧪 Testing

### Manuelles Testing

```bash
# App installieren
npm run install-app

# Logs live ansehen
homey app log

# API testen
curl -H "Authorization: Bearer TOKEN" \
     https://api.homematic.com/v1/devices
```

### Debug-Logging

```typescript
// In der App
this.log('Debug-Nachricht');
this.error('Fehler:', error);

// Mit Kontext
this.log('Device State:', JSON.stringify(state, null, 2));
```

## 📦 Build und Deployment

### Lokaler Build

```bash
# TypeScript kompilieren
npm run build

# App validieren
npm run validate

# App installieren
npm run install-app
```

### Production Build

```bash
# Dependencies bereinigen
npm ci

# Build erstellen
npm run build

# App packen
homey app build
```

## 🐛 Debugging

### VSCode Launch Configuration

Erstelle `.vscode/launch.json`:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Homey App",
      "runtimeExecutable": "homey",
      "runtimeArgs": ["app", "run"],
      "cwd": "${workspaceFolder}",
      "console": "integratedTerminal"
    }
  ]
}
```

### Breakpoints setzen

```typescript
// In TypeScript-Code
debugger; // Breakpoint

// Logs mit Details
console.log('Device ID:', deviceId);
console.log('Full Data:', JSON.stringify(deviceData, null, 2));
```

## 🔍 Code-Qualität

### Linting (optional)

```bash
# ESLint installieren
npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin

# ESLint ausführen
npx eslint src/ --ext .ts
```

### Type-Checking

```bash
# TypeScript Type-Check ohne Kompilierung
npx tsc --noEmit
```

## 📊 Performance-Optimierung

### WebSocket-Reconnect-Strategie

Exponentielles Backoff implementiert:

```typescript
private scheduleReconnect(): void {
  const delay = Math.min(1000 * Math.pow(2, attempts), 30000);
  // Max 30 Sekunden Wartezeit
}
```

### HTTP-Request-Caching

```typescript
private deviceCache = new Map<string, any>();

async getDevice(deviceId: string): Promise<any> {
  if (this.deviceCache.has(deviceId)) {
    return this.deviceCache.get(deviceId);
  }
  
  const device = await this.httpClient.get(`/devices/${deviceId}`);
  this.deviceCache.set(deviceId, device);
  
  // Cache nach 60 Sekunden invalidieren
  setTimeout(() => this.deviceCache.delete(deviceId), 60000);
  
  return device;
}
```

## 📚 Weitere Ressourcen

- [Homey SDK Docs](https://apps.developer.homey.app/)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Axios Docs](https://axios-http.com/docs/intro)
- [WebSocket Docs](https://github.com/websockets/ws)

## 🤝 Contribution Guidelines

Siehe [CONTRIBUTING.md](../CONTRIBUTING.md)

---

Happy Coding! 🚀

