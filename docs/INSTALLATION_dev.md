# 💻 Installation für Entwickler

Technische Anleitung zur lokalen Entwicklung und zum Deployment der Homematic IP App für Homey.

---

## 📋 Voraussetzungen

### Software

- **Node.js** >= 18.0.0 LTS
- **npm** >= 9.0.0
- **Git**
- **Homey CLI**: `npm install -g homey`
- **TypeScript** (wird via npm installiert)

### Hardware

- **Homey Pro** (beliebiges Modell) für Testing
- **Homematic IP HCU** (empfohlen für vollständiges Testing)

### Accounts

- **Athom Account** für Homey CLI Login
- **GitHub Account** (für Contributions)

---

## 🔧 Setup

### 1. Repository klonen

```bash
git clone https://github.com/marioco-de/HOMEYmatic-cAPI.git
cd HOMEYmatic-cAPI
```

### 2. Dependencies installieren

```bash
npm install
```

Dies installiert:
- TypeScript und Typen
- WebSocket Bibliothek (`ws`)
- Axios für HTTP Requests
- Homey SDK Typen

### 3. TypeScript kompilieren

```bash
npm run build
```

Build-Output landet in `build/` (wird von `.gitignore` ausgeschlossen).

### 4. Homey CLI konfigurieren

```bash
# Bei Homey einloggen
homey login

# Dein Homey auswählen
homey select
```

---

## 🚀 Entwicklungs-Workflow

### Development Mode (mit Hot Reload)

```bash
# TypeScript im Watch-Modus
npm run watch
```

In einem separaten Terminal:

```bash
# App auf Homey ausführen (Debug-Modus)
homey app run
```

**Logs in Echtzeit:**

```bash
# Separates Terminal
homey app log
```

### Chrome DevTools Debugging

1. Starte App mit `homey app run`
2. Öffne Chrome: `chrome://inspect`
3. Klicke auf **"Configure..."** → Füge `localhost:9229` hinzu
4. Wähle den Remote Target aus
5. Setze Breakpoints in den kompilierten `.js` Dateien

---

## 📁 Projektstruktur

```
HOMEYmatic-cAPI/
├── src/                          # TypeScript Source Code
│   ├── app.ts                   # Main App Class
│   ├── api.ts                   # Settings API Endpoints
│   ├── lib/
│   │   ├── HomematicConnectAPI.ts    # WebSocket + REST Client
│   │   └── HomematicDevice.ts        # Base Device Class
│   └── drivers/
│       ├── hmip-switch/
│       │   ├── driver.ts        # Driver Logic
│       │   └── device.ts        # Device Logic
│       ├── hmip-dimmer/
│       ├── hmip-thermostat/
│       ├── hmip-sensor/
│       ├── hmip-contact/
│       ├── hmip-windowcoverings/
│       └── hmip-remote/
│
├── build/                       # Compiled JavaScript (gitignored)
│   ├── app.js
│   ├── api.js
│   ├── lib/
│   └── drivers/
│
├── settings/
│   └── index.html              # Settings Page UI
│
├── drivers/                    # Driver Assets (per Driver)
│   └── hmip-*/
│       ├── device.js          # Symlink to build/
│       ├── driver.js          # Symlink to build/
│       └── assets/
│           ├── icon.svg
│           └── images/
│
├── assets/                     # App Assets
│   ├── icon.svg
│   └── images/
│
├── dev-tools/                  # Development Utilities
│   ├── hcu-token-generator.html
│   ├── hcu-connection-test.html
│   └── hcu-rest-test.html
│
├── app.json                    # Homey App Manifest
├── package.json
├── tsconfig.json
└── .gitignore
```

---

## 🛠️ NPM Scripts

```json
{
  "build": "tsc",                    // TypeScript kompilieren
  "watch": "tsc --watch",            // Watch-Modus
  "dev": "homey app run",            // App auf Homey starten
  "install-app": "homey app install", // App installieren
  "validate": "homey app validate",   // App validieren
  "validate:verified": "homey app validate --level verified"
}
```

### Verwendung

```bash
# Kompilieren
npm run build

# Watch-Modus (auto-rebuild on change)
npm run watch

# App validieren
npm run validate

# Verified Level validieren
npm run validate:verified
```

---

## 🔌 HCU API Konfiguration

### HCU einrichten

**📖 [Ausführliche HCU-Einrichtungsanleitung →](HCU_SETUP.md)**

Für lokales Testing:

1. **HCU Developer Mode aktivieren** (siehe [HCU_SETUP.md](HCU_SETUP.md))
2. **Token generieren** via HCU Webinterface oder Homey App Settings
3. **Credentials in App-Settings eingeben**

### API Endpoints

- **Webinterface**: `https://hcu1-XXXX.local` (XXXX = letzte 4 Zeichen der SGTIN)
- **REST API**: `https://hcu1-XXXX.local:6969`
- **WebSocket**: `wss://hcu1-XXXX.local:9001`

### Self-Signed Certificate

Die HCU nutzt ein selbstsigniertes Zertifikat. In der App wird dies via `rejectUnauthorized: false` akzeptiert:

```typescript
// In HomematicConnectAPI.ts
this.ws = new WebSocket(wsUrl, {
  rejectUnauthorized: false,
  // ...
});
```

---

## 🧪 Testing

### Manuelle Tests

1. **Verbindungstest**
   - Settings-Seite öffnen
   - "Verbindung testen" klicken
   - Logs prüfen: `homey app log`

2. **Gerät hinzufügen**
   - Gerätetyp auswählen
   - Gerät aus Liste wählen
   - Device hinzufügen
   - Logs prüfen

3. **Flow Cards testen**
   - Flow erstellen mit App-Trigger/Action
   - Flow ausführen
   - Logs und Geräte-Status prüfen

### Dev-Tools

Im `dev-tools/` Ordner:

- **`hcu-token-generator.html`**: Token direkt via Browser generieren
- **`hcu-connection-test.html`**: WebSocket Verbindung testen
- **`hcu-rest-test.html`**: REST API Calls testen

Diese Tools öffnen **lokal im Browser** (nicht auf Homey).

---

## 🐛 Debugging

### Logs analysieren

```bash
# Alle Logs
homey app log

# Nur Errors
homey app log | grep -E "ERR|ERROR|✖"

# Nur eigene App-Logs
homey app log | grep "HomematicApp"
```

### Häufige Debug-Szenarien

#### WebSocket Connection

```typescript
// In HomematicConnectAPI.ts
this.ws.on('open', () => {
  this.logger('✅ WebSocket connected');
});

this.ws.on('error', (error) => {
  this.errorLogger('❌ WebSocket error:', error);
});
```

#### API Requests

```typescript
// HTTP Request mit Axios
try {
  const response = await this.httpClient.get('/devices');
  console.log('Devices:', response.data);
} catch (error) {
  console.error('API Error:', error.response?.data);
}
```

---

## 📦 Deployment

### App validieren

```bash
# Standard Level (debug)
homey app validate

# Publish Level
homey app validate --level publish

# Verified Developer Level
homey app validate --level verified
```

### Build Checklist

- [ ] `npm run build` erfolgreich
- [ ] `homey app validate --level verified` erfolgreich
- [ ] Alle Driver haben `icon.svg`
- [ ] `app.json` vollständig
- [ ] `README.md` aktuell
- [ ] `CHANGELOG.md` aktualisiert

### Version erhöhen

```bash
# package.json und app.json manuell anpassen
# Dann committen
git add .
git commit -m "Release v1.0.0"
git tag v1.0.0
git push origin main --tags
```

### Homey App Store

```bash
# App zur Review einreichen
homey app publish
```

**Hinweis**: Die App nutzt `homey:manager:api` Permission, was eine gründlichere Review erfordert.

---

## 🔧 Erweiterungen

### Neuen Device Driver hinzufügen

1. **Driver-Ordner erstellen**

```bash
mkdir -p src/drivers/hmip-newdevice
mkdir -p drivers/hmip-newdevice/assets/images
```

2. **Driver und Device implementieren**

```typescript
// src/drivers/hmip-newdevice/driver.ts
import Homey from 'homey';
import HomematicDriver from '../../lib/HomematicDriver';

class NewDeviceDriver extends HomematicDriver {
  async onInit() {
    this.log('New Device Driver initialized');
  }
}

module.exports = NewDeviceDriver;
```

```typescript
// src/drivers/hmip-newdevice/device.ts
import HomematicDevice from '../../lib/HomematicDevice';

class NewDevice extends HomematicDevice {
  async onInit() {
    await super.onInit();
    // Custom initialization
  }
}

module.exports = NewDevice;
```

3. **Driver in `app.json` registrieren**

```json
{
  "drivers": [
    {
      "id": "hmip-newdevice",
      "name": {
        "de": "Neues Gerät",
        "en": "New Device"
      },
      "class": "socket",
      "capabilities": ["onoff"],
      // ...
    }
  ]
}
```

4. **Icons hinzufügen**

- `drivers/hmip-newdevice/assets/icon.svg`
- `drivers/hmip-newdevice/assets/images/large.png` (500x500)
- `drivers/hmip-newdevice/assets/images/small.png` (75x75)

5. **Build und Test**

```bash
npm run build
homey app run
```

---

## 🤝 Contribution Guidelines

1. **Fork** das Repository
2. **Branch** erstellen: `git checkout -b feature/awesome-feature`
3. **Änderungen** committen: `git commit -m 'Add awesome feature'`
4. **Tests** durchführen
5. **Push**: `git push origin feature/awesome-feature`
6. **Pull Request** öffnen

### Code Style

- **TypeScript** für alle Source Files
- **ESLint** Regeln beachten
- **Kommentare** auf Englisch
- **Logs** auf Deutsch (User-facing)

### Commit Messages

```
<type>: <subject>

Types: feat, fix, docs, style, refactor, test, chore
```

**Beispiele:**
```
feat: Add support for HmIP-DLD door locks
fix: Resolve WebSocket reconnection issue
docs: Update installation guide
```

---

## 📚 Weitere Ressourcen

### Dokumentation

- [Homey SDK Docs](https://apps-sdk-v3.developer.homey.app/)
- [Homematic IP Connect API Docs](./connect-api-documentation-1.0.1.html)
- [Project Overview](PROJECT_OVERVIEW.md)
- [API Documentation](docs/API.md)
- [Development Guide](docs/DEVELOPMENT.md)

