# Changelog

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt [Semantic Versioning](https://semver.org/lang/de/).

---

## [0.9.0] - 2025-01-09

### Hinzugefügt

#### 🎯 Core Features
- **7 Gerätetypen** vollständig unterstützt:
  - 💡 **Schalter** (`hmip-switch`) - HmIP-PS, HmIP-PSM, HmIP-BSM, HmIP-FSM, HmIP-FSM16, HmIP-PCBS, HmIP-MOD-OC8
  - 🔆 **Dimmer** (`hmip-dimmer`) - HmIP-BDT, HmIP-FDT, HmIP-PDT, Legacy HM-LC-Dim1*
  - 🌡️ **Thermostate** (`hmip-thermostat`) - HmIP-eTRV, HmIP-eTRV-2, HmIP-eTRV-B, HmIP-eTRV-B-2, HmIP-eTRV-C, HmIP-eTRV-E, HmIP-BWTH, HmIP-WTH, HmIP-WTH-2, HmIP-STH
  - 📊 **Sensoren** (`hmip-sensor`) - HmIP-STH, HmIP-STHD, HmIP-STHO, HmIP-SWO, HmIP-SMI, HmIP-SMI55, HmIP-SMO
  - 🚪 **Tür-/Fensterkontakte** (`hmip-contact`) - HmIP-SWDO, HmIP-SWDM, HmIP-SWDM-2, HmIP-SWDO-I, HmIP-SWDO-PL
  - 🎚️ **Rollläden/Jalousien** (`hmip-windowcoverings`) - HmIP-BROLL, HmIP-FROLL, HmIP-BBL, HmIP-FBL, HmIP-DRBLI4
  - 🎛️ **Wandtaster/Fernbedienungen** (`hmip-remote`) - HmIP-WRC2, HmIP-WRC6, HmIP-RC8, HmIP-WRCC2

#### 🎨 User Interface
- **Moderne Settings-Seite** mit verbesserter UX
  - Interactive Feature-Tour für neue Nutzer
  - SGTIN-basierte HCU-Suche (letzte 4 Zeichen eingeben)
  - Token-Generator-Wizard mit Schritt-für-Schritt-Anleitung
  - Developer Mode Anleitung direkt integriert
  - Support & Bug-Report Buttons
  - Zusammenklappbare Hilfesektionen
  - Responsive Design

#### 🔧 Technische Features
- **SGTIN-basierte HCU-Suche**
  - Automatisches Finden der HCU über die letzten 4 Zeichen der SGTIN
  - Konstruiert automatisch den Hostnamen `hcu1-{letzte-4-Zeichen}.local`
  - Validierung (4 Zeichen, Hexadezimal)
  - Direkter Link zum HCU Web-Interface nach erfolgreicher Suche
- **Connection Timeout** für WebSocket-Verbindungen (verhindert App-Crashes)
- **Automatische Token-Generierung** über HCU REST API
- **Self-Signed Certificate Support** für HCU HTTPS

#### 📱 Flow Cards
- **Schalter**: Ein/Aus
- **Dimmer**: Ein/Aus, Helligkeit 0-100%
- **Thermostate**: Zieltemperatur setzen (5-30°C)
- **Rollläden**: Öffnen, Schließen, Stoppen, Position setzen (0-100%)
- **Kontakte**: Flow-Trigger bei Öffnen/Schließen
- **Wandtaster**: Flow-Trigger für Tastendrücke (SHORT/LONG/LONG_START/LONG_END)

#### 📚 Dokumentation
- Vollständige Dokumentation in `docs/` Ordner
  - Installation für Endnutzer
  - Installation für Entwickler
  - HCU Setup Guide
  - Quick Start Guide
  - Unterstützte Geräte
  - API-Dokumentation
  - Development Guide
  - Contributing Guidelines

### Verbessert
- App startet jetzt auch ohne HCU-Konfiguration (kann später eingerichtet werden)
- Bessere Visualisierung von Verbindungsstatus
- Optimierte Anleitung für manuelle Token-Generierung
- Fehlerbehandlung bei fehlender oder unterbrochener HCU-Verbindung
- Automatische Reconnect-Logik mit besseren Timeouts
- WebSocket-Performance optimiert
- Geräte-Synchronisierung verbessert

### Geändert
- Development-Tools in separaten Ordner (`dev-tools/`) verschoben
- Dokumentation komplett überarbeitet und strukturiert
- Projektstruktur optimiert

### Behoben
- App crasht nicht mehr beim Start wenn HCU nicht erreichbar ist
- Flow-Aktionen haben jetzt korrekte `titleFormatted` Felder
- WebSocket-Verbindungsfehler werden korrekt abgefangen
- Position-Mapping zwischen HmIP und Homey korrigiert

### Technisch
- **Node.js**: >= 18.0.0 erforderlich
- **Homey SDK**: 3
- **TypeScript**: Vollständig typisiert
- **Dependencies**: `axios`, `ws`, `uuid`, `homey`
- **Validation Level**: ✅ Verified Developer

---

## Hinweise zur Versionierung

### Versionsschema
- **Major (X.0.0)**: Breaking Changes, große neue Features
- **Minor (0.X.0)**: Neue Features, neue Gerätetypen
- **Patch (0.0.X)**: Bugfixes, kleine Verbesserungen

### Kategorien
- **Hinzugefügt** - Neue Features
- **Geändert** - Änderungen an bestehenden Features
- **Veraltet** - Features, die bald entfernt werden
- **Entfernt** - Entfernte Features
- **Behoben** - Bugfixes
- **Sicherheit** - Security-Fixes

---

## Roadmap

### In Überlegung
- [ ] Finale Stabilisierung
- [ ] Performance-Optimierungen
- [ ] Vollständige Test-Coverage
- [ ] Mehrsprachige Unterstützung (NL erweitern)
- [ ] Garagentore (HmIP-MOD-HO)
- [ ] Türschlösser (HmIP-DLD)
- [ ] Alarmsirenen (HmIP-ASIR, HmIP-ASIR-2)
- [ ] Rauchmelder (HmIP-SWSD)
- [ ] Wassersensoren (HmIP-SWD)
- [ ] CO2-Sensoren
- [ ] Durchsagesysteme (HmIP-MP3P)
- [ ] Erweiterte Szenen-Unterstützung
- [ ] Geräte-Gruppierung

---

*Letzte Aktualisierung: November 2025*
