# Homematic IP Connect API für Homey

Eine moderne Homey-App für Homematic IP Geräte, die die offizielle **Homematic IP Connect API** über die **Home Control Unit (HCU)** nutzt.

---

## 🚀 Features

- **🏠 Lokal & Privat**: Funktioniert komplett im lokalen Netzwerk ohne Cloud
- **⚡ Echtzeit-Updates**: Sofortige Benachrichtigung über Geräteänderungen via WebSocket
- **📱 Benutzerfreundlich**: Einfache Konfiguration mit SGTIN-Suche und Token-Generator
- **🔧 Entwickler-Modus**: Offene API der HCU - kostenlos für alle nutzbar
- **💻 Modern**: TypeScript-basiert für typsichere und wartbare Entwicklung
- **🔌 Umfangreich**: 7 Gerätetypen, 56+ Modelle unterstützt

---

## 📋 Voraussetzungen

- **Homey Pro** (beliebiges Modell, SDK 3)
- **Homematic IP Home Control Unit (HCU)** - ca. 150-200€
- Deine Homematic IP Geräte sind an der HCU angelernt
- HCU und Homey im gleichen Netzwerk

---

## 🛠️ Installation & Konfiguration

### 📖 Ausführliche Anleitungen

| Zielgruppe | Dokument | Beschreibung |
|------------|----------|--------------|
| **👤 Endnutzer** | **[📱 Installation für Endnutzer](docs/INSTALLATION_user.md)** | Schritt-für-Schritt: App installieren, HCU einrichten, Token generieren, Geräte hinzufügen |
| **💻 Entwickler** | **[💻 Installation für Entwickler](docs/INSTALLATION_dev.md)** | Repository Setup, Build-Prozess, Debugging, Testing, Contributions |
| **🚀 Quick Start** | **[Quick Start Guide](QUICKSTART.md)** | In 5 Minuten zum ersten Gerät |
| **🔧 HCU Setup** | **[HCU Setup Guide](docs/HCU_SETUP.md)** | Detaillierte HCU-Konfiguration (für alle HCU-Modelle) |

### Kurzübersicht - Endnutzer

1. **App installieren** aus dem Homey App Store
2. **HCU Developer Mode aktivieren**: `https://hcu1-XXXX.local` (XXXX = letzte 4 Zeichen der SGTIN)
3. **Token generieren** in den App-Settings über den integrierten Wizard
4. **Geräte hinzufügen** über die Homey App

👉 **[Zur vollständigen Anleitung](docs/INSTALLATION_user.md)**

### Kurzübersicht - Entwickler

```bash
# Repository klonen
git clone https://github.com/marioco-de/HOMEYmatic-cAPI.git
cd HOMEYmatic-cAPI

# Installation und Build
npm install && npm run build

# App auf Homey starten
homey app run
```

👉 **[Zur Entwickler-Dokumentation](docs/INSTALLATION_dev.md)**

---

## 🎯 Unterstützte Geräte

**Vollständige Liste:** **[📋 SUPPORTED_DEVICES.md](docs/SUPPORTED_DEVICES.md)**

| Kategorie | Beispielgeräte | Funktionen |
|-----------|----------------|------------|
| **💡 Schalter** | HmIP-PS, HmIP-PSM, HmIP-BSM, HmIP-FSM | Ein/Aus, Stromverbrauch |
| **🔆 Dimmer** | HmIP-BDT, HmIP-FDT | Ein/Aus, Helligkeit 0-100% |
| **🌡️ Thermostate** | HmIP-eTRV, HmIP-eTRV-2, HmIP-WTH | Temperatur, Ventilposition, Boost |
| **📊 Sensoren** | HmIP-STH, HmIP-SMI, HmIP-SWO | Temperatur, Luftfeuchte, Bewegung |
| **🚪 Kontakte** | HmIP-SWDO, HmIP-SWDM | Offen/Geschlossen, Sabotage |
| **🎚️ Rollläden** | HmIP-BROLL, HmIP-FROLL, HmIP-BBL | Position 0-100%, Lamellen |
| **🎛️ Fernbedienungen** | HmIP-WRC6, HmIP-RC8 | Tastendrücke, Flow-Trigger |

**Gesamt:** 7 Treiber, 56+ Modelle (HmIP und HM-Legacy)

---

## 💡 Besondere Features

### 🎨 Moderne Settings-Seite

- **Interactive Feature-Tour** für neue Nutzer
- **SGTIN-basierte HCU-Suche** (einfach letzte 4 Zeichen eingeben)
- **Token-Generator-Wizard** mit Schritt-für-Schritt-Anleitung
- **Developer Mode Anleitung** direkt integriert
- **Support & Bug-Report Buttons**

### 🔌 Technische Highlights

- **WebSocket-Verbindung** für Echtzeit-Updates (Port 9001)
- **REST API Integration** für Befehle (Port 6969)
- **Automatische Wiederverbindung** bei Verbindungsabbrüchen
- **Self-Signed Certificate Support** für HCU HTTPS
- **Fehlertoleranz**: App startet auch ohne HCU-Verbindung

---

## 🗺️ Roadmap

- [ ] Unterstützung für weitere Gerätetypen:
  - [ ] Türschlösser (HmIP-DLD)
  - [ ] Alarmsirenen (HmIP-ASIR)
  - [ ] Rauchmelder (HmIP-SWSD)
  - [ ] Wassersensoren (HmIP-SWD)
- [ ] Erweiterte Flow-Karten
- [ ] Geräte-Gruppierung
- [ ] Mehrsprachige Unterstützung (NL erweitern)

---

## 📚 Dokumentation

| Dokument | Beschreibung |
|----------|--------------|
| **[docs/INSTALLATION_user.md](docs/INSTALLATION_user.md)** | Installation für Endnutzer |
| **[docs/INSTALLATION_dev.md](docs/INSTALLATION_dev.md)** | Installation für Entwickler |
| **[QUICKSTART.md](QUICKSTART.md)** | 5-Minuten Quick Start |
| **[docs/HCU_SETUP.md](docs/HCU_SETUP.md)** | HCU-Konfiguration (für alle HCU-Modelle) |
| **[docs/SUPPORTED_DEVICES.md](docs/SUPPORTED_DEVICES.md)** | Vollständige Geräteliste |
| **[docs/CHANGELOG.md](docs/CHANGELOG.md)** | Versionshistorie |
| **[docs/PROJECT_OVERVIEW.md](docs/PROJECT_OVERVIEW.md)** | Projekt-Übersicht & Architektur |
| **[docs/CONTRIBUTING.md](docs/CONTRIBUTING.md)** | Beitragen zum Projekt |
| **[docs/API.md](docs/API.md)** | API-Referenz |
| **[docs/DEVELOPMENT.md](docs/DEVELOPMENT.md)** | Entwickler-Guide |

---

## 🐛 Troubleshooting

### Häufige Probleme

**HCU nicht gefunden?**
- Prüfe SGTIN (letzte 4 Zeichen korrekt?)
- HCU und Homey im gleichen Netzwerk?
- Alternativ: IP-Adresse direkt eingeben

**Token-Generierung fehlgeschlagen?**
- Developer Mode aktiviert?
- WebSocket freigegeben?
- Aktivierungsschlüssel nicht abgelaufen? (10 Min. gültig)

**Geräte reagieren nicht?**
- Batterie leer? (bei batteriebetriebenen Geräten)
- Gerät in Homematic IP App funktionsfähig?
- Verbindung in App-Settings testen

👉 **[Vollständige FAQ in INSTALLATION_user.md](docs/INSTALLATION_user.md#-häufige-fragen)**

---

## 🆘 Support & Community

### GitHub - Primärer Support-Kanal

Für Fragen, Probleme und Feature-Requests nutze bitte **GitHub Issues**:

**🐞 [Bug melden oder Feature anfragen](https://github.com/marioco-de/HOMEYmatic-cAPI/issues/new)**

| Was | Wo |
|-----|-----|
| **🐛 Bugs & Probleme** | [GitHub Issues](https://github.com/marioco-de/HOMEYmatic-cAPI/issues) |
| **💡 Feature-Requests** | [GitHub Issues](https://github.com/marioco-de/HOMEYmatic-cAPI/issues) |
| **📖 Dokumentation** | [GitHub Wiki](https://github.com/marioco-de/HOMEYmatic-cAPI/wiki) |
| **💬 Diskussionen** | [GitHub Discussions](https://github.com/marioco-de/HOMEYmatic-cAPI/discussions) |
| **👥 Homey Community** | [community.homey.app](https://community.homey.app/) |

### Zusätzliche Hilfe

- **💬 Helpdesk**: [o1.simplebase.co](https://o1.simplebase.co/)
- **🌐 Website**: [marioco.de](https://www.marioco.de) | [o1.digital](https://o1.digital)

---

## ⚖️ DISCLAIMER & HAFTUNGSAUSSCHLUSS

### STATUS: BETA SOFTWARE (Version < 1.0)

**⚠️ WICHTIGE SICHERHEITSHINWEISE**

- Diese Software dient ausschließlich zur **ZUSÄTZLICHEN Steuerung**
- **Nicht als alleinige Steuerung** für sicherheitsrelevante Funktionen verwenden
- Primäre Heizungssteuerung/Frostwächter **MUSS funktionsfähig bleiben**
- Regelmäßige manuelle Kontrolle aller gesteuerten Geräte erforderlich
- **Die Nutzung erfolgt AUSDRÜCKLICH auf eigene Gefahr**

### HAFTUNGSBESCHRÄNKUNG

Die Software wird "**AS IS**" ohne jegliche Gewährleistung bereitgestellt. Der Entwickler haftet nicht für:
- Sachschäden an Geräten oder Systemen
- Datenverlust oder Fehlfunktionen  
- Folgeschäden jeder Art
- Ausfälle durch leere Batterien oder Verbindungsprobleme

Ausgenommen: Schäden aus der Verletzung des Lebens, des Körpers oder der Gesundheit sowie Haftung nach dem Produkthaftungsgesetz.

### UNABHÄNGIGKEIT

Diese Software ist ein **unabhängiges Drittanbieter-Produkt** und steht in keiner Geschäftsbeziehung zur eQ-3 AG. Homematic und Homematic IP sind eingetragene Marken der eQ-3 AG.

**Mit der Installation/Nutzung akzeptieren Sie diese Bedingungen vollumfänglich.**

---

## 📊 Status

**Version**: 0.9.0  
**Status**: Beta (in aktiver Entwicklung)  
**SDK**: Homey SDK 3  
**Node Version**: >= 18.0.0  
**Validation Level**: ✅ Verified Developer

---

## 👏 Credits & Danksagungen

- **eQ-3 AG**: Homematic IP System & HCU mit offener Connect API
- **Athom**: Homey Platform und SDK
- **Timo Wendt** ([@LRuesink-WebArray](https://github.com/LRuesink-WebArray)): Inspiration durch die [homey-matic App](https://github.com/LRuesink-WebArray/homey-matic)
- **Community**: Feedback, Testing und Unterstützung

---

## 📄 Lizenz

Dieses Projekt ist unter der **MIT-Lizenz** lizenziert - siehe [LICENSE](LICENSE) für Details.

---

## 🤝 Beitragen

Contributions sind willkommen! Siehe **[CONTRIBUTING.md](CONTRIBUTING.md)** für Guidelines.

1. Fork das Repository
2. Feature-Branch erstellen
3. Änderungen committen
4. Tests durchführen
5. Pull Request öffnen

---

**Made with ❤️ for the Homey Community**

**Autor**: Mario Kempter  
**Website**: [marioco.de](https://www.marioco.de) | [o1.digital](https://o1.digital)  
**Email**: sos@marioco.de

