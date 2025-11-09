# 🚀 Quick Start Guide

In 5 Minuten zur ersten Homematic IP Steuerung mit Homey!

---

## ✅ Checkliste (vor dem Start)

- [ ] **Homey Pro** vorhanden und online
- [ ] **Homematic IP HCU** vorhanden und im Netzwerk
- [ ] Homematic IP **Geräte an HCU angelernt**
- [ ] **SGTIN** der HCU bekannt (auf Rückseite der HCU)
- [ ] **Smartphone** mit Homey App

---

## 🎯 In 5 Minuten starten

### Schritt 1: App installieren (1 Min.)

1. Öffne **Homey App** auf dem Smartphone
2. **Einstellungen** → **Apps** → Suche **"Homematic IP"**
3. Klicke **"Installieren"**

✅ Die App ist installiert! Konfiguration folgt im nächsten Schritt.

---

### Schritt 2: HCU vorbereiten (2 Min.)

**📖 [Ausführliche HCU-Einrichtungsanleitung →](docs/HCU_SETUP.md)**

Kurzfassung:
1. **HCU Webinterface öffnen**: `https://hcu1-XXXX.local` (XXXX = letzte 4 Zeichen der SGTIN)
2. **Developer Mode aktivieren** und **WebSocket freigeben**
3. **6-stelligen Aktivierungsschlüssel generieren** (10 Min. gültig!)

👉 **[Vollständige Schritt-für-Schritt-Anleitung](docs/HCU_SETUP.md)**

---

### Schritt 3: App konfigurieren (2 Min.)

#### In der Homey App

1. **Einstellungen** → **Apps** → **Homematic IP** → **"Konfigurieren"**

#### SGTIN-Suche nutzen

1. Gib die **letzten 4 Zeichen** deiner SGTIN ein (z.B. `12D3`)
2. Klicke **"🔍 Mit SGTIN suchen"**
3. ✅ HCU gefunden! Das Feld wird automatisch ausgefüllt

#### Token generieren

1. Scrolle zum **"Token-Generator-Wizard"**
2. Klicke **"Wizard öffnen"**
3. Gib den **6-stelligen Code** aus Schritt 2 ein
4. Klicke **"Token generieren"**
5. ✅ Token wurde automatisch übernommen

#### Verbindung testen und speichern

1. Klicke **"Verbindung testen"** (optional)
2. Klicke **"Speichern"**
3. 🎉 **Fertig!** Die App ist jetzt verbunden

---

## 📱 Erstes Gerät hinzufügen

### Gerät hinzufügen (1 Min.)

1. In der Homey App: **Geräte** → **+ Gerät hinzufügen**
2. Wähle **"Homematic IP (Connect API)"**
3. Wähle Gerätetyp (z.B. **"Schalter"**)
4. Wähle dein Gerät aus der Liste
5. Klicke **"Hinzufügen"**
6. ✅ **Geschafft!** Dein erstes Gerät ist verbunden

### Gerät testen

1. Gehe zu **Geräte**
2. Tippe auf dein neu hinzugefügtes Gerät
3. Schalte es **Ein/Aus**
4. 🎊 **Es funktioniert!**

---

## 🎭 Erster Flow (Bonus)

### Beispiel: Licht bei Bewegung

1. **Flows** → **+ Neuer Flow**

2. **WENN (Trigger):**
   - Wähle **Bewegungsmelder** (falls vorhanden)
   - Trigger: **"Bewegung erkannt"**

3. **DANN (Aktion):**
   - Wähle **Steckdose/Licht**
   - Aktion: **"Einschalten"**

4. **Speichern und aktivieren**

5. 🌟 **Test:** Bewege dich vor dem Sensor → Licht geht an!

---

## 🔥 Beliebte Anwendungsfälle

### 1. Temperaturbasierte Heizungssteuerung

**Flow:**
- **WENN**: Temperatur < 18°C
- **DANN**: Thermostat auf 21°C setzen

### 2. Automatische Rollläden

**Flow:**
- **WENN**: Sonnenaufgang
- **DANN**: Rollläden öffnen

**Flow 2:**
- **WENN**: Sonnenuntergang
- **DANN**: Rollläden schließen

### 3. Alarmierung bei offenem Fenster

**Flow:**
- **WENN**: Fensterkontakt → offen
- **UND**: Außentemperatur < 10°C
- **DANN**: Benachrichtigung senden

### 4. Zentral-Aus mit Wandtaster

**Flow:**
- **WENN**: Wandtaster → Taste 1 gedrückt
- **DANN**: Alle Lichter ausschalten

---

## 💡 Pro-Tipps

### Feature-Tour nutzen

In den App-Settings: **"Tour starten"** für eine geführte Einrichtung!

### Mehrere Geräte gleichzeitig hinzufügen

Bei "Gerät hinzufügen" kannst du mehrere Geräte gleichzeitig auswählen!

### SGTIN merken

Notiere die letzten 4 Zeichen deiner SGTIN - du brauchst sie bei jeder Neukonfiguration.

### Developer Mode aktiv lassen

Der Developer Mode kann aktiv bleiben - er beeinträchtigt die HCU-Funktion nicht.

---

## ❓ Probleme?

### HCU nicht gefunden

- **SGTIN korrekt?** Nur die letzten 4 Zeichen eingeben
- **Im gleichen Netzwerk?** HCU und Homey müssen im selben WLAN/LAN sein
- **Alternative:** Gib die IP-Adresse direkt ein (findest du im Router)

### Token-Generierung fehlgeschlagen

- **Code abgelaufen?** Generiere einen neuen 6-stelligen Code in der HCU
- **WebSocket freigegeben?** Prüfe HCU-Einstellungen
- **Developer Mode aktiv?** Prüfe HCU-Einstellungen

### Keine Geräte werden angezeigt

- **Geräte an HCU angelernt?** Prüfe in der Homematic IP App
- **Verbindung aktiv?** Teste in den App-Settings
- **HCU erreichbar?** Teste: `https://hcu1-XXXX.local` im Browser

---

## 📖 Weitere Hilfe

| Ressource | Link |
|-----------|------|
| **Vollständige Anleitung** | [INSTALLATION_user.md](docs/INSTALLATION_user.md) |
| **HCU Setup** | [HCU_SETUP.md](docs/HCU_SETUP.md) |
| **Entwickler-Guide** | [INSTALLATION_dev.md](docs/INSTALLATION_dev.md) |
| **Unterstützte Geräte** | [SUPPORTED_DEVICES.md](docs/SUPPORTED_DEVICES.md) |
| **🐛 Bug melden** | [GitHub Issues](https://github.com/marioco-de/HOMEYmatic-cAPI/issues) |
| **💬 Helpdesk** | [o1.simplebase.co](https://o1.simplebase.co/) |

---

## 🎉 Geschafft!

Du hast erfolgreich:
- ✅ Die App installiert
- ✅ Die HCU konfiguriert
- ✅ Dein erstes Gerät hinzugefügt
- ✅ (Optional) Deinen ersten Flow erstellt

**Jetzt kannst du alle deine Homematic IP Geräte mit Homey steuern!**

---

**Viel Spaß mit deinem Smart Home! 🏡**

