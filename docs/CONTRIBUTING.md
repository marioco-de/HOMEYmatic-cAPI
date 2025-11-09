# Beitragen zu Homematic IP Connect

Vielen Dank für dein Interesse, zu diesem Projekt beizutragen! 

## 🚀 Wie du beitragen kannst

### Bug Reports

Wenn du einen Bug gefunden hast:

1. Überprüfe, ob der Bug bereits gemeldet wurde
2. Öffne ein neues Issue mit:
   - Detaillierter Beschreibung des Problems
   - Schritten zum Reproduzieren
   - Erwartetes vs. tatsächliches Verhalten
   - Homey-Version und App-Version
   - Logs (falls relevant)

### Feature Requests

Für neue Features:

1. Öffne ein Issue mit dem "Feature Request" Label
2. Beschreibe das gewünschte Feature
3. Erkläre den Use Case
4. Diskutiere mit der Community

### Code-Beiträge

1. **Fork** das Repository
2. **Clone** deinen Fork:
   ```bash
   git clone https://github.com/DEIN_USERNAME/HOMEYmatic-cAPI.git
   ```
3. **Erstelle einen Branch**:
   ```bash
   git checkout -b feature/mein-neues-feature
   ```
4. **Implementiere deine Änderungen**:
   - Halte dich an den bestehenden Code-Stil
   - Füge TypeScript-Types hinzu
   - Kommentiere komplexe Logik
   - Teste deine Änderungen

5. **Commit** deine Änderungen:
   ```bash
   git commit -m "feat: füge neue Funktion XYZ hinzu"
   ```

6. **Push** zum Branch:
   ```bash
   git push origin feature/mein-neues-feature
   ```

7. **Öffne einen Pull Request**

## 📝 Coding Standards

### TypeScript

- Verwende TypeScript für alle neuen Dateien
- Definiere explizite Types
- Nutze Interfaces für Objekt-Strukturen
- Vermeide `any` wo möglich

### Naming Conventions

```typescript
// Klassen: PascalCase
class HomematicDevice {}

// Funktionen/Methoden: camelCase
async getDevices() {}

// Konstanten: SCREAMING_SNAKE_CASE
const MAX_RECONNECT_ATTEMPTS = 10;

// Private Properties: _camelCase
private _deviceId: string;
```

### Code-Struktur

```typescript
// 1. Imports
import Homey from 'homey';

// 2. Types/Interfaces
interface DeviceData {
  id: string;
}

// 3. Klassen-Definition
class MyDevice extends Homey.Device {
  // 4. Properties
  private api: API;

  // 5. Constructor
  constructor() {}

  // 6. Lifecycle Methods
  async onInit() {}

  // 7. Public Methods
  async turnOn() {}

  // 8. Private Methods
  private updateState() {}
}
```

### Kommentare

```typescript
/**
 * JSDoc für Funktionen/Klassen
 * @param deviceId Die Geräte-ID
 * @returns Promise mit Device-Daten
 */
async getDevice(deviceId: string): Promise<DeviceData> {
  // Inline-Kommentare für komplexe Logik
  const data = await this.api.get(`/devices/${deviceId}`);
  return data;
}
```

## 🧪 Testing

Bevor du einen PR einreichst:

```bash
# TypeScript kompilieren
npm run build

# App validieren
npm run validate

# Auf Homey testen
npm run install-app
```

## 📦 Commit Messages

Verwende [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` Neues Feature
- `fix:` Bug Fix
- `docs:` Dokumentation
- `style:` Code-Formatierung
- `refactor:` Code-Refactoring
- `test:` Tests
- `chore:` Wartung

Beispiele:
```
feat: füge Unterstützung für Rollläden hinzu
fix: behebe Verbindungsproblem bei Reconnect
docs: aktualisiere Installation-Guide
```

## 🔍 Code Review

Pull Requests werden auf folgende Punkte geprüft:

- ✅ Code-Qualität und -Stil
- ✅ TypeScript-Types korrekt
- ✅ Keine Breaking Changes ohne Diskussion
- ✅ Dokumentation aktualisiert
- ✅ Funktioniert auf Homey
- ✅ Keine neuen Linter-Fehler

## 📚 Ressourcen

- [Homey SDK Documentation](https://apps.developer.homey.app/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Homematic IP API Docs](https://developer.homematic-ip.com/)

## 💬 Fragen?

Bei Fragen:
- Öffne ein Issue
- Diskutiere im Homey Community Forum

## 📜 Lizenz

Mit dem Beitragen stimmst du zu, dass deine Beiträge unter der MIT-Lizenz lizenziert werden.

---

Vielen Dank für deine Beiträge! 🎉

