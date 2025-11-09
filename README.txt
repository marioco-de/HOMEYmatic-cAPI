Homematic IP Connect API für Homey

Eine moderne Homey-App für Homematic IP Geräte, die die offizielle Homematic IP Connect API über die Home Control Unit (HCU) nutzt.

WAS DIE APP MACHT:
- Verbindet Homematic IP Geräte mit Homey über die offizielle Connect API
- Funktioniert komplett lokal im Netzwerk ohne Cloud
- Echtzeit-Updates über WebSocket-Verbindung
- Einfache Konfiguration mit integriertem Token-Generator

BESONDERHEITEN:
- Lokal & privat: Alle Daten bleiben im lokalen Netzwerk
- Echtzeit-Updates: Sofortige Benachrichtigung über Geräteänderungen
- Benutzerfreundlich: SGTIN-Suche und Token-Generator-Wizard
- Developer Mode: Nutzt die offene API der HCU (kostenlos für alle)
- Modern: TypeScript-basiert für zuverlässige Funktionalität

BENÖTIGTE GERÄTE:
- Homey Pro (beliebiges Modell, SDK 3)
- Homematic IP Home Control Unit (HCU) - ca. 150-200€
- Homematic IP Geräte müssen an der HCU angelernt sein
- HCU und Homey müssen im gleichen Netzwerk sein

UNTERSTÜTZTE GERÄTE:
7 Treiber mit insgesamt 56+ Modellen:

• Schalter (8+ Modelle)
  HmIP-PS, HmIP-PSM, HmIP-BSM, HmIP-FSM, HmIP-FSM16, HmIP-PCBS, HmIP-MOD-OC8
  Funktionen: Ein/Aus, Stromverbrauch (bei PSM)

• Dimmer (4+ Modelle)
  HmIP-BDT, HmIP-FDT, HmIP-PDT, HM-LC-Dim1PWM-CV, HM-LC-Dim1T-CV/DR/FM
  Funktionen: Ein/Aus, Helligkeit 0-100%

• Thermostate (9+ Modelle)
  HmIP-eTRV, HmIP-eTRV-2, HmIP-eTRV-B, HmIP-eTRV-B-2, HmIP-eTRV-C, HmIP-eTRV-E,
  HmIP-BWTH, HmIP-WTH, HmIP-WTH-2, HmIP-STH, HM-CC-RT-DN
  Funktionen: Temperatur, Ventilposition, Boost, Luftfeuchte (bei Wandthermostaten)

• Sensoren (8+ Modelle)
  HmIP-STH, HmIP-STHD, HmIP-STHO, HmIP-SWO, HmIP-SMI, HmIP-SMI55, HmIP-SMO,
  HM-WDS10-TH-O, HM-WDS30-T-O
  Funktionen: Temperatur, Luftfeuchte, Bewegung, Helligkeit

• Tür-/Fensterkontakte (10+ Modelle)
  HmIP-SWDO, HmIP-SWDM, HmIP-SWDM-2, HmIP-SWDO-I, HmIP-SWDO-PL,
  HM-Sec-SC, HM-Sec-SC-2, HM-Sec-SCo, HM-Sec-RHS
  Funktionen: Offen/Geschlossen, Sabotage-Alarm, Batteriestatus

• Rollläden/Jalousien (7+ Modelle)
  HmIP-BROLL, HmIP-FROLL, HmIP-BBL, HmIP-FBL, HmIP-DRBLI4,
  HM-LC-Bl1-FM, HM-LC-Bl1PBU-FM
  Funktionen: Position 0-100%, Lamellenwinkel, Stopp-Funktion

• Wandtaster/Fernbedienungen (10+ Modelle)
  HmIP-WRC2, HmIP-WRC6, HmIP-RC8, HmIP-WRCC2,
  HM-PB-2-WM55-2, HM-PB-4-WM, HM-PB-6-WM55, HM-RC-4, HM-RC-8, HM-RC-Key4
  Funktionen: Tastendrücke, Flow-Trigger (kurz/lang)

Alle weiterführenden Informationen, Anleitungen und Konfigurationshilfen finden Sie in der Settings-Seite der App.

