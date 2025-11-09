# Projekt-Übersicht: Homematic IP Connect für Homey

## 📊 Zusammenfassung

Eine moderne TypeScript-basierte Homey-App, die Homematic IP Geräte über die offizielle Connect API integriert.

### Kernmerkmale

✅ **Moderne Technologie**: TypeScript für Typsicherheit und bessere Wartbarkeit  
✅ **Offizielle API**: Nutzt Homematic IP Connect REST + WebSocket API  
✅ **Echtzeit-Updates**: WebSocket-Verbindung für sofortige Benachrichtigungen  
✅ **Umfassende Unterstützung**: Schalter, Dimmer, Thermostate, Sensoren  
✅ **Robust**: Automatische Wiederverbindung bei Problemen  
✅ **Gut dokumentiert**: Ausführliche Dokumentation und Beispiele  

## 📁 Projektstruktur

```
HOMEYmatic-cAPI/
│
├── 📄 README.md                 # Haupt-Dokumentation
├── 📄 QUICKSTART.md             # Schnellstart-Anleitung
├── 📄 INSTALLATION.md           # Detaillierte Installation
├── 📄 CONTRIBUTING.md           # Contribution Guidelines
├── 📄 LICENSE                   # MIT-Lizenz
├── 📄 PROJECT_OVERVIEW.md       # Diese Datei
│
├── 📦 package.json              # NPM-Konfiguration & Dependencies
├── 📦 tsconfig.json             # TypeScript-Konfiguration
├── 📦 app.json                  # Homey App Manifest
├── 📦 .homeychangelog.json      # Changelog für Homey Store
├── 📦 .gitignore                # Git Ignore-Regeln
├── 📦 .homeyignore              # Homey Ignore-Regeln
│
├── 🔧 app.js                    # JavaScript-Wrapper → build/app.js
├── 🔧 api.js                    # JavaScript-Wrapper → build/api.js
│
├── 📂 src/                      # TypeScript-Quellcode
│   ├── 📄 app.ts               # Haupt-App-Klasse
│   ├── 📄 api.ts               # API-Endpunkte für Settings
│   │
│   ├── 📂 lib/                 # Bibliotheken
│   │   ├── 📄 HomematicConnectAPI.ts    # API-Client (REST + WebSocket)
│   │   └── 📄 HomematicDevice.ts        # Basis-Device-Klasse
│   │
│   └── 📂 drivers/             # Geräte-Driver (TypeScript)
│       ├── 📂 hmip-switch/
│       │   ├── 📄 driver.ts    # Switch-Driver
│       │   └── 📄 device.ts    # Switch-Device
│       ├── 📂 hmip-dimmer/
│       │   ├── 📄 driver.ts    # Dimmer-Driver
│       │   └── 📄 device.ts    # Dimmer-Device
│       ├── 📂 hmip-thermostat/
│       │   ├── 📄 driver.ts    # Thermostat-Driver
│       │   └── 📄 device.ts    # Thermostat-Device
│       └── 📂 hmip-sensor/
│           ├── 📄 driver.ts    # Sensor-Driver
│           └── 📄 device.ts    # Sensor-Device
│
├── 📂 build/                    # Kompilierter TypeScript-Code (automatisch)
│   ├── app.js
│   ├── api.js
│   ├── lib/
│   └── drivers/
│
├── 📂 drivers/                  # JavaScript-Wrapper für Driver
│   ├── 📂 hmip-switch/
│   │   ├── driver.js           # Wrapper → build/drivers/hmip-switch/driver.js
│   │   ├── device.js           # Wrapper → build/drivers/hmip-switch/device.js
│   │   └── 📂 assets/          # Icons & Bilder
│   ├── 📂 hmip-dimmer/         # (analog zu switch)
│   ├── 📂 hmip-thermostat/     # (analog zu switch)
│   └── 📂 hmip-sensor/         # (analog zu switch)
│
├── 📂 settings/                 # Settings-Seite
│   └── 📄 index.html           # Konfigurations-UI
│
├── 📂 assets/                   # App-Assets
│   ├── 📂 images/
│   │   ├── large.png           # App-Icon groß (500x500)
│   │   └── small.png           # App-Icon klein (250x250)
│   └── 📄 README.md
│
├── 📂 docs/                     # Dokumentation
│   ├── 📄 API.md               # API-Dokumentation
│   └── 📄 DEVELOPMENT.md       # Entwickler-Dokumentation
│
└── 📂 .github/                  # GitHub-Konfiguration
    └── 📂 workflows/
        └── 📄 validate.yml      # CI/CD Workflow
```

## 🔧 Technologie-Stack

### Frontend
- **HTML5/CSS3**: Settings-Seite
- **Vanilla JavaScript**: Browser-seitiger Code

### Backend (Homey App)
- **TypeScript 5.3**: Haupt-Programmiersprache
- **Node.js >= 18**: Runtime-Umgebung
- **Homey SDK 3**: Homey-Framework

### Bibliotheken
- **axios**: HTTP-Client für REST API
- **ws**: WebSocket-Client für Echtzeit-Updates
- **homey**: Homey SDK Types

### Build-Tools
- **TypeScript Compiler**: Kompilierung zu JavaScript
- **npm**: Paketmanager

## 📊 Architektur-Übersicht

### Komponenten-Hierarchie

```
┌─────────────────────────────────────────────────────────────┐
│                    Homey Platform                           │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              HomematicApp (Haupt-App-Klasse)                │
│  • Verwaltet API-Client                                     │
│  • Registriert Flow-Karten                                  │
│  • Lifecycle-Management                                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│         HomematicConnectAPI (API-Client)                    │
│  • REST API (Axios)                                         │
│  • WebSocket (ws)                                           │
│  • Event Emitter                                            │
│  • Auto-Reconnect                                           │
└─────────────────────────────────────────────────────────────┘
                              │
                ┌─────────────┴─────────────┐
                ▼                           ▼
┌───────────────────────────┐   ┌───────────────────────────┐
│      Device Drivers       │   │    HomematicDevice        │
│  • Switch Driver          │   │  (Basis-Klasse)           │
│  • Dimmer Driver          │   │  • Update-Handler         │
│  • Thermostat Driver      │   │  • Capability-Manager     │
│  • Sensor Driver          │   │  • Lifecycle              │
└───────────────────────────┘   └───────────────────────────┘
                │                           │
                └───────────┬───────────────┘
                            ▼
            ┌───────────────────────────────┐
            │      Device Instances         │
            │  • Switch Device              │
            │  • Dimmer Device              │
            │  • Thermostat Device          │
            │  • Sensor Device              │
            └───────────────────────────────┘
```

### Datenfluss

#### 1. Gerät steuern (User → API)

```
User Interaktion (Homey App)
    ↓
Homey Platform
    ↓
Device.onCapabilityListener('onoff', true)
    ↓
HomematicConnectAPI.turnOn(deviceId, channelId)
    ↓
HTTP PUT /devices/{id}/channels/{ch}/state
    ↓
Homematic IP Cloud
    ↓
Gerät (physisch)
```

#### 2. Status-Update (API → User)

```
Gerät (physisch) - Zustandsänderung
    ↓
Homematic IP Cloud
    ↓
WebSocket-Nachricht
    ↓
HomematicConnectAPI.on('device_update')
    ↓
Device.updateFromDeviceData()
    ↓
Device.setCapabilityValue('onoff', newState)
    ↓
Homey Platform
    ↓
User Interface Update
```

## 🎯 Unterstützte Funktionen

### Gerätetypen

| Typ | Klasse | Capabilities | Steuerbar |
|-----|--------|--------------|-----------|
| **Switch** | `socket` | `onoff` | ✅ |
| **Dimmer** | `light` | `onoff`, `dim` | ✅ |
| **Thermostat** | `thermostat` | `target_temperature`, `measure_temperature` | ✅ |
| **Sensor** | `sensor` | `measure_temperature`, `measure_humidity` | ❌ (read-only) |

### Flow-Karten

**Trigger:**
- Gerätezustand hat sich geändert

**Actions:**
- Gerät einschalten
- Gerät ausschalten
- (weitere werden automatisch von Homey generiert)

### API-Endpunkte

**Settings-API:**
- `GET /devices` - Alle Geräte abrufen
- `POST /testConnection` - Verbindung testen
- `POST /saveConfig` - Konfiguration speichern
- `GET /status` - API-Status abrufen

## 📈 Statistiken

### Codebase

- **TypeScript-Dateien**: 13 Dateien
- **JavaScript-Wrapper**: 10 Dateien
- **Dokumentation**: 7 Dateien
- **Gesamt LOC**: ~3000 Zeilen

### Features

- ✅ 4 Gerätetypen unterstützt
- ✅ 50+ Homematic IP Modelle kompatibel
- ✅ REST + WebSocket API
- ✅ Echtzeit-Updates
- ✅ Auto-Reconnect
- ✅ Umfassende Dokumentation

## 🔄 Development Workflow

### Standard-Workflow

```bash
# 1. Code ändern
vim src/app.ts

# 2. Kompilieren
npm run build

# 3. Installieren
npm run install-app

# 4. Testen
homey app log
```

### Schneller Workflow (Watch-Modus)

```bash
# Terminal 1
npm run watch       # Auto-Kompilierung

# Terminal 2
npm run dev         # Live-Reload

# Terminal 3
homey app log       # Live-Logs
```

## 🚀 Deployment

### Lokal testen

```bash
npm run build
npm run install-app
```

### Homey App Store (zukünftig)

```bash
npm run build
homey app validate
homey app publish
```

## 📊 Abhängigkeiten

### Production Dependencies

```json
{
  "axios": "^1.6.0",      // HTTP-Client
  "ws": "^8.14.0",        // WebSocket-Client
  "homey": "^3.0.0"       // Homey SDK
}
```

### Development Dependencies

```json
{
  "@types/node": "^20.10.0",
  "@types/ws": "^8.5.9",
  "typescript": "^5.3.0",
  "homey-cli": "^3.0.0"
}
```

## 🔐 Sicherheit

- ✅ HTTPS für alle API-Anfragen
- ✅ WSS (WebSocket Secure) für Echtzeit-Verbindung
- ✅ Tokens werden sicher in Homey Settings gespeichert
- ✅ Keine Tokens in Logs
- ✅ Rate-Limiting-Behandlung

## 📝 Lizenz

**MIT License** - Siehe [LICENSE](LICENSE)

## 👥 Mitwirkende

Siehe [CONTRIBUTING.md](CONTRIBUTING.md) für Guidelines.

## 🔗 Links

- **GitHub**: https://github.com/marioco-de/HOMEYmatic-cAPI
- **Homey Community**: https://community.homey.app/
- **Homematic IP**: https://homematic-ip.com/
- **Developer Portal**: https://developer.homematic-ip.com/

