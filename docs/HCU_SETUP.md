# 🔧 Homematic IP Home Control Unit (HCU) Setup

Anleitung zur Einrichtung der **Homematic IP Home Control Unit (HCU)** für die Nutzung mit der Homey App.

---

## 📋 Was du brauchst

- ✅ **Homematic IP Home Control Unit (HCU)**
- ✅ Deine Homematic IP Geräte sind an der HCU angelernt (Ein Anlernen direkt über die Homey App funktionier (noch?) nicht)
- ✅ HCU ist im gleichen Netzwerk wie Homey
- ✅ Zugriff auf die HCU Weboberfläche

---

## 🎯 Vorteile der HCU

| Feature | Beschreibung |
|---------|--------------|
| 🏠 **Lokal** | Funktioniert ohne Internet, alles im Heimnetz |
| 🔓 **Offene API** | Developer Mode für alle kostenlos verfügbar |
| ⚡ **Schnell** | Direkte Verbindung im LAN, keine Cloud-Latenz |
| 🔒 **Privat** | Daten bleiben im Heimnetz, kein Cloud-Zwang |
| 💰 **Kostenlos** | Keine Abo-Gebühren, keine laufenden Kosten |
| 🔧 **Flexibel** | Mehrere Integrationen parallel möglich |

---

## 🌐 HCU Ports & Zugänge

Die HCU bietet verschiedene Schnittstellen:

| Service | URL/Port | Verwendung | Protokoll |
|---------|----------|------------|-----------|
| **Webinterface** | `https://hcu1-XXXX.local` | HCU Admin-Oberfläche | HTTPS (Port 443) |
| **REST API** | `https://hcu1-XXXX.local:6969` | Connect API (HTTP Requests) | HTTPS |
| **WebSocket** | `wss://hcu1-XXXX.local:9001` | Echtzeit-Events | WSS |

**XXXX** = die letzten 4 Zeichen deiner SGTIN (z.B. `12D3`)

**Beispiele:**
```
Webinterface: https://hcu1-12D3.local
REST API:     https://hcu1-12D3.local:6969/hmip/home/getCurrentState
WebSocket:    wss://hcu1-12D3.local:9001
```

---

## 📖 Schritt-für-Schritt-Anleitung

### **Schritt 1: SGTIN finden**

Die **SGTIN** (Serial Number / Geräte-ID) brauchst du für den Zugriff auf die HCU.

**Wo finde ich die SGTIN?**

1. **Auf der Rückseite der HCU**: 24 Zeichen (z.B. `1234A123B12312C3123412D3`)
2. **In der Homematic IP App**:
   - Einstellungen → Access Point / HCU
   - SGTIN wird angezeigt

**Wichtig:** Du brauchst nur die **letzten 4 Zeichen** (z.B. `12D3`)!

---

### **Schritt 2: HCU Webinterface öffnen**

#### Methode A: Via SGTIN (empfohlen)

```
https://hcu1-XXXX.local
```

Ersetze **XXXX** durch die **letzten 4 Zeichen** deiner SGTIN.

**Beispiel:**
- SGTIN: `1234A123B12312C3123412D3`
- URL: `https://hcu1-12D3.local`

#### Methode B: Via IP-Adresse

Wenn die SGTIN-Methode nicht funktioniert, nutze die IP-Adresse:

```
https://192.168.x.x
```

**IP-Adresse finden:**
1. Im **Router** (z.B. Fritzbox): Netzwerk → Geräte → "Homematic"
2. In der **Homematic IP App**: Einstellungen → Access Point
3. Via **Netzwerk-Scanner** (z.B. Fing, Advanced IP Scanner)

#### Sicherheitswarnung ignorieren

Die HCU nutzt ein selbstsigniertes Zertifikat. Im Browser erscheint:

```
⚠️ "Die Verbindung ist nicht sicher"
```

**Klicke:** "Erweitert" → "Trotzdem fortfahren" / "Weiter zu hcu1-XXXX.local"

Dies ist **normal und sicher**, da die HCU im lokalen Netz läuft!

---

### **Schritt 3: In der HCU anmelden**

**Standard-Zugangsdaten:**
- **Benutzername**: `admin`
- **Passwort**: Das Passwort, das du bei der HCU-Ersteinrichtung festgelegt hast

**Passwort vergessen?**
→ Factory Reset erforderlich (siehe HCU-Anleitung)

---

### **Schritt 4: Developer Mode aktivieren**

#### 4.1 Menü öffnen

1. Oben links auf das **☰ Hamburger-Menü** klicken
2. Wähle **"Entwicklermodus"** oder **"Developer Mode"**

#### 4.2 Developer Mode einschalten

1. Lies die Informationen gründlich durch
2. Aktiviere: ☑️ **"Entwicklermodus aktivieren"**

#### 4.3 WebSocket freigeben

Scrolle zu **"Remote-Verbindungen"** und aktiviere:
- ☑️ **"WebSocket freigeben"**

**Wichtig:** Ohne WebSocket funktionieren die Echtzeit-Updates nicht!

#### 4.4 Einstellungen speichern

Klicke **"Übernehmen"** oder **"Speichern"**

---

### **Schritt 5: Aktivierungsschlüssel generieren**

#### 5.1 Key generieren

1. Im Developer Mode Bereich
2. Klicke auf den Button **"Generieren"**
3. Ein **6-stelliger Code** wird angezeigt (z.B. `A1B2C3`)

#### 5.2 Code kopieren

**⏱️ WICHTIG:** Der Code ist nur **10 Minuten gültig**!

Kopiere den Code **sofort** und nutze ihn im nächsten Schritt (Token-Generierung in der Homey App).

**Tipp:** Notiere den Code auf Papier oder in einem Editor.

---

## 🔒 Sicherheitshinweise

### ✅ Best Practices

1. **Starkes Admin-Passwort** für HCU verwenden
2. **HCU nicht direkt ins Internet** exponieren
3. **Auth Token geheim halten** (wie ein Passwort)
4. **Regelmäßige Firmware-Updates** der HCU durchführen

### ⚠️ Was du NICHT tun solltest

- ❌ HCU-Admin-Zugang mit anderen teilen
- ❌ Auth Token öffentlich posten
- ❌ HCU ohne Passwortschutz lassen
- ❌ Port 6969/9001 ins Internet weiterleiten

---

## ❓ Häufige Fragen

### Kann ich mehrere Apps gleichzeitig mit der HCU verbinden?

✅ **Ja!** Die HCU unterstützt mehrere gleichzeitige Verbindungen.

- Homey App (diese App)
- Homematic IP App (Smartphone)
- ioBroker, Home Assistant, etc.

### Muss der Developer Mode dauerhaft aktiv bleiben?

✅ **Ja**, solange du die Homey App nutzen möchtest.

**Keine Sorge:** Der Developer Mode beeinträchtigt die normale HCU-Funktion nicht!

### Ist die Verbindung sicher?

✅ **Ja!**

- Verbindung läuft **nur im lokalen Netzwerk**
- HTTPS/WSS verschlüsselt
- Kein Cloud-Zugriff erforderlich
- Auth Token schützt vor unbefugtem Zugriff

### Kann ich die HCU gleichzeitig mit der Homematic IP App nutzen?

✅ **Ja!** Die Smartphone-App funktioniert parallel weiter.

### Kostet der Developer Mode etwas?

❌ **Nein!** Der Developer Mode ist kostenlos und ohne Einschränkungen nutzbar.

---

## 🔗 Weiterführende Links

### Projekt-Dokumentation

- **[Installation für Endnutzer](INSTALLATION_user.md)** - Vollständige App-Installation
- **[Installation für Entwickler](INSTALLATION_dev.md)** - Entwickler-Setup
- **[Quick Start Guide](../QUICKSTART.md)** - 5-Minuten-Guide
- **[Geräte-Liste](SUPPORTED_DEVICES.md)** - Unterstützte Geräte

### Offizielle Dokumentation

- **[Connect API Dokumentation](../connect-api-documentation-1.0.1.html)** (lokal im Projekt)
- **[Homematic IP Entwicklerportal](https://developer.homematic-ip.com/)**

---

*Diese Anleitung gilt für die Homematic IP Home Control Unit HmIP-HCU-1. Für zukünftige Modelle oder CCU3-Erweiterungen kann die Einrichtung abweichen.*

