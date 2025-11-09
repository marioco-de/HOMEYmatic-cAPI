# Unterstützte Geräte - Vollständige Liste

## 📊 Übersicht

| Kategorie | Anzahl Treiber | Anzahl Modelle | Status |
|-----------|----------------|----------------|--------|
| **Schalter** | 1 | 8+ | ✅ Vollständig |
| **Dimmer** | 1 | 4+ | ✅ Vollständig |
| **Thermostate** | 1 | 9+ | ✅ Vollständig |
| **Sensoren** | 1 | 8+ | ✅ Vollständig |
| **Tür-/Fensterkontakte** | 1 | 10+ | ✅ **NEU** |
| **Rollläden/Jalousien** | 1 | 7+ | ✅ **NEU** |
| **Wandtaster/Fernbedienungen** | 1 | 10+ | ✅ **NEU** |
| **GESAMT** | **7 Treiber** | **56+ Modelle** | ✅ |

---

## 1️⃣ Schalter (Switch)

**Driver ID:** `hmip-switch`  
**Homey Klasse:** `socket`  
**Capabilities:** `onoff`

### Unterstützte Modelle:

| Modell | Beschreibung | Kanäle |
|--------|--------------|--------|
| **HmIP-PS** | Schalt-Steckdose | 1 |
| **HmIP-PSM** | Schalt-Steckdose mit Leistungsmessung | 1 |
| **HmIP-BSM** | Schaltaktor für Markenschalter | 1 |
| **HmIP-FSM** | Schaltaktor Hutschiene, 1-fach | 1 |
| **HmIP-FSM16** | Schaltaktor Hutschiene, 16-fach | 16 |
| **HmIP-PCBS** | Schaltplatine | 1 |
| **HmIP-MOD-OC8** | Open-Collector-Modul | 8 |
| **HMIP-PS** / **HMIP-PSM** | Ältere Modellbezeichnungen | 1 |

### Funktionen:
- ✅ Ein-/Ausschalten
- ✅ Stromverbrauch anzeigen (bei PSM)
- ✅ Echtzeit-Status-Updates

---

## 2️⃣ Dimmer

**Driver ID:** `hmip-dimmer`  
**Homey Klasse:** `light`  
**Capabilities:** `onoff`, `dim`

### Unterstützte Modelle:

| Modell | Beschreibung | Leistung |
|--------|--------------|----------|
| **HmIP-BDT** | Dimmaktor für Markenschalter | 200W |
| **HmIP-FDT** | Dimmaktor für Hutschiene | 200W |
| **HmIP-PDT** | Dimmer-Steckdose | variabel |
| **HM-LC-Dim1PWM-CV** | PWM-Dimmer (Legacy) | variabel |
| **HM-LC-Dim1T-CV/DR/FM** | Triac-Dimmer (Legacy) | 400W |

### Funktionen:
- ✅ Ein-/Ausschalten
- ✅ Helligkeit 0-100%
- ✅ Rampenzeit einstellbar
- ✅ Soft-Start/Soft-Stop

---

## 3️⃣ Thermostate

**Driver ID:** `hmip-thermostat`  
**Homey Klasse:** `thermostat`  
**Capabilities:** `target_temperature`, `measure_temperature`

### Unterstützte Modelle:

| Modell | Typ | Display | Besonderheiten |
|--------|-----|---------|----------------|
| **HmIP-eTRV** | Heizkörper | Nein | Standard |
| **HmIP-eTRV-2** | Heizkörper | Ja | Verbessert |
| **HmIP-eTRV-B** | Heizkörper | Nein | Kompakt |
| **HmIP-eTRV-B-2** | Heizkörper | Nein | Kompakt, verbessert ✨ **NEU** |
| **HmIP-eTRV-C** | Heizkörper | Ja | Kompakt mit Display |
| **HmIP-eTRV-E** | Heizkörper | Ja | Evolution |
| **HmIP-BWTH** | Wand | Ja | Mit Luftfeuchte |
| **HmIP-WTH** / **HmIP-WTH-2** | Wand | Ja | Wandthermostat |
| **HmIP-STH** | Wand/Tisch | Nein | Mit Schaltausgang |
| **HM-CC-RT-DN** | Heizkörper | Ja | Legacy |

### Funktionen:
- ✅ Zieltemperatur setzen (5-30°C)
- ✅ Aktuelle Temperatur anzeigen
- ✅ Ventilposition anzeigen
- ✅ Luftfeuchtigkeit (bei Wandthermostaten)
- ✅ Boost-Funktion
- ✅ Fenster-offen-Erkennung

---

## 4️⃣ Sensoren

**Driver ID:** `hmip-sensor`  
**Homey Klasse:** `sensor`  
**Capabilities:** `measure_temperature`, `measure_humidity`

### Unterstützte Modelle:

| Modell | Messungen | Montage | Batterie |
|--------|-----------|---------|----------|
| **HmIP-STH** | Temp + Feuchte | Innen | ✅ |
| **HmIP-STHD** | Temp + Feuchte + Display | Innen | ✅ |
| **HmIP-STHO** | Temp + Feuchte | Außen | ✅ |
| **HmIP-SWO** | Wetter-Multi | Außen | Netzbetrieb |
| **HmIP-SMI** | Bewegung + Helligkeit | Innen | ✅ |
| **HmIP-SMI55** | Bewegung (55er Rahmen) | Wand | ✅ |
| **HmIP-SMO** | Präsenz | Außen | ✅ |
| **HM-WDS10-TH-O** | Temp + Feuchte (Legacy) | Außen | ✅ |
| **HM-WDS30-T-O** | Temperatur (Legacy) | Außen | ✅ |

### Funktionen:
- ✅ Temperatur messen (-40°C bis +65°C)
- ✅ Luftfeuchtigkeit messen (0-100%)
- ✅ Bewegungserkennung
- ✅ Helligkeitsmessung
- ✅ Batteriestatus

---

## 5️⃣ Tür-/Fensterkontakte ✨ **NEU**

**Driver ID:** `hmip-contact`  
**Homey Klasse:** `sensor`  
**Capabilities:** `alarm_contact`, `alarm_battery`, `alarm_tamper`

### Unterstützte Modelle:

| Modell | Typ | Besonderheiten |
|--------|-----|----------------|
| **HmIP-SWDO** | Standard-Kontakt | Aufputz |
| **HmIP-SWDM** | Magnet-Kontakt | Verdeckt |
| **HmIP-SWDM-2** | Magnet-Kontakt Gen. 2 | Verdeckt, verbessert ✨ **ANGEFORDERT** |
| **HmIP-SWDO-I** | Kontakt | Unterputz |
| **HmIP-SWDO-PL** | Kontakt | Für Kunststofffenster |
| **HM-Sec-SC** / **HM-Sec-SC-2** | Kontakt (Legacy) | Standard |
| **HM-Sec-SCo** | Optischer Kontakt (Legacy) | Ohne Magnet |
| **HM-Sec-RHS** | Drehgriff-Sensor (Legacy) | 3 Positionen |

### Funktionen:
- ✅ Offen/Geschlossen-Erkennung
- ✅ Gekippt-Erkennung (bei RHS)
- ✅ Sabotage-Alarm
- ✅ Batteriestatus
- ✅ Flow-Trigger bei Öffnen/Schließen

---

## 6️⃣ Rollläden/Jalousien ✨ **NEU**

**Driver ID:** `hmip-windowcoverings`  
**Homey Klasse:** `blinds`  
**Capabilities:** `windowcoverings_set`, `windowcoverings_tilt_set`

### Unterstützte Modelle:

| Modell | Typ | Montage | Kanäle |
|--------|-----|---------|--------|
| **HmIP-BROLL** | Rollladen | Unterputz | 1 ✨ **ANGEFORDERT** |
| **HmIP-FROLL** | Rollladen | Hutschiene | 1 ✨ **ANGEFORDERT** |
| **HmIP-BBL** | Jalousie | Unterputz | 1 |
| **HmIP-FBL** | Jalousie | Hutschiene | 1 |
| **HmIP-DRBLI4** | Jalousie | Hutschiene | 4 |
| **HM-LC-Bl1-FM** | Rollladen (Legacy) | Unterputz | 1 |
| **HM-LC-Bl1PBU-FM** | Rollladen (Legacy) | Unterputz | 1 |

### Funktionen:
- ✅ Öffnen/Schließen
- ✅ Position setzen (0-100%)
- ✅ Lamellenwinkel einstellen (bei Jalousien)
- ✅ Stopp-Funktion
- ✅ Referenzfahrt
- ✅ Hinderniserkennung

### Flow-Karten:
- ✅ Öffnen
- ✅ Schließen
- ✅ Stoppen
- ✅ Position auf X% setzen

---

## 7️⃣ Wandtaster/Fernbedienungen ✨ **NEU**

**Driver ID:** `hmip-remote`  
**Homey Klasse:** `button`  
**Capabilities:** (keine, nur Events)

### Unterstützte Modelle:

| Modell | Tasten | Typ | Besonderheiten |
|--------|--------|-----|----------------|
| **HmIP-WRC2** | 2 | Wandtaster | Standard |
| **HmIP-WRC6** | 6 | Wandtaster | 3×2 Wippen ✨ **ANGEFORDERT** |
| **HmIP-RC8** | 8 | Fernbedienung | Mit Display |
| **HmIP-WRCC2** | 2 | Wandtaster | Farbig (schwarz) |
| **HM-PB-2-WM55-2** | 2 | Wandtaster (Legacy) | 55er Rahmen |
| **HM-PB-4-WM** | 4 | Wandtaster (Legacy) | Aufputz |
| **HM-PB-6-WM55** | 6 | Wandtaster (Legacy) | 55er Rahmen |
| **HM-RC-4** | 4 | Fernbedienung (Legacy) | Kompakt |
| **HM-RC-8** | 8 | Fernbedienung (Legacy) | Standard |
| **HM-RC-Key4** | 4 | Schlüsselanhänger (Legacy) | Klein |

### Funktionen:
- ✅ Tastendrücke erkennen
- ✅ Kurzer Druck
- ✅ Langer Druck
- ✅ Langer Druck Start/Ende
- ✅ Batteriestatus

### Flow-Trigger:
- ✅ Taste wurde gedrückt (mit Tastenummer)
- ✅ Unterscheidung: SHORT / LONG / LONG_START / LONG_END

---

## 📊 Statistik

### Nach Hersteller-Serie:

| Serie | Anzahl Modelle | Status |
|-------|----------------|--------|
| **HmIP (neue Serie)** | 45+ | ✅ Vollständig |
| **HM (Legacy)** | 11+ | ✅ Vollständig |

### Nach Funktion:

| Funktion | Anzahl | Prozent |
|----------|--------|---------|
| **Steuerbar** | 30+ | 54% |
| **Nur lesbar** | 26+ | 46% |

### Nach Stromversorgung:

| Typ | Anzahl |
|-----|--------|
| **Netzbetrieb** | 24+ |
| **Batteriebetrieb** | 32+ |

---

## 🔄 Erweiterbarkeit

Die App-Architektur ermöglicht einfaches Hinzufügen neuer Gerätetypen:

### Geplante Erweiterungen:

- [ ] **Garagentore** (HmIP-MOD-HO)
- [ ] **Türschlösser** (HmIP-DLD)
- [ ] **Alarmsirenen** (HmIP-ASIR, HmIP-ASIR-2)
- [ ] **Rauchmelder** (HmIP-SWSD)
- [ ] **Wassersensoren** (HmIP-SWD)
- [ ] **CO2-Sensoren**
- [ ] **Durchsagesysteme** (HmIP-MP3P)

### Anleitung:

Siehe `docs/DEVELOPMENT.md` → "Neuen Gerätetyp hinzufügen"

---

## 🎯 Compatibility Matrix

| Homematic Serie | Unterstützt | Via |
|-----------------|-------------|-----|
| **Homematic IP** | ✅ Vollständig | Connect API |
| **Homematic (BidCos)** | ✅ Teilweise | Connect API (Legacy-Geräte) |
| **Homematic Wired** | ❌ Nicht unterstützt | - |

---

## 📝 Hinweise

### ✨ Neu hinzugefügte Geräte (auf Anfrage):
- **HmIP-WRC6** - 6-fach Wandtaster
- **HmIP-eTRV-B-2** - Heizkörperthermostat kompakt Gen. 2
- **HmIP-SWDM-2** - Tür-/Fensterkontakt Gen. 2
- **HmIP-BROLL** - Rollladenaktor Unterputz
- **HmIP-FROLL** - Rollladenaktor Hutschiene

### Allgemein:
1. **Multi-Channel-Geräte**: Geräte mit mehreren Kanälen (z.B. FSM16) werden als separate Devices hinzugefügt
2. **Legacy-Geräte**: Ältere HM-Geräte funktionieren, wenn sie mit einem Homematic IP Access Point gekoppelt sind
3. **Updates**: Neue Geräte können jederzeit durch Updates hinzugefügt werden

