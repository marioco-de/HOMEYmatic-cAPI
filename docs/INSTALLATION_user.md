# 🏠 Installation für Endnutzer

Einfache Anleitung zur Installation und Einrichtung der Homematic IP App für Homey.

---

## 📋 Was du brauchst

- ✅ **Homey Pro** (beliebiges Modell)
- ✅ **Homematic IP Home Control Unit (HCU)**
- ✅ Deine Homematic IP Geräte sind an der HCU angelernt (Das Anlernen funktioniert (noch) nicht über die App)
- ✅ HCU ist im gleichen Netzwerk wie Homey

---

## 🚀 Installation in 3 Schritten

### Schritt 1: App installieren

1. Öffne die **Homey App** auf deinem Smartphone
2. Gehe zu **Einstellungen** → **Apps**
3. Suche nach **"Homematic IP"**
4. Klicke auf **"Installieren"**

**Hinweis:** Die App kann sofort installiert werden - die Konfiguration erfolgt danach!

---

### Schritt 2: HCU einrichten

**📖 [Ausführliche HCU-Einrichtungsanleitung →](HCU_SETUP.md)**

Die HCU muss für die Nutzung mit Homey vorbereitet werden:

1. **HCU Webinterface öffnen**: `https://hcu1-XXXX.local` (XXXX = letzte 4 Zeichen der SGTIN)
2. **Developer Mode aktivieren** und **WebSocket freigeben**
3. **6-stelligen Aktivierungsschlüssel generieren** (10 Min. gültig!)

👉 **[Vollständige Schritt-für-Schritt-Anleitung](HCU_SETUP.md)**

---

### Schritt 3: App konfigurieren

#### 3.1 Settings öffnen

1. In der Homey App: **Einstellungen** → **Apps** → **Homematic IP**
2. Klicke auf **"Konfigurieren"**

#### 3.2 HCU finden (Methode A - empfohlen)

1. Gib die **letzten 4 Zeichen deiner SGTIN** ein (z.B. `12D3`)
2. Klicke auf **"🔍 Mit SGTIN suchen"**
3. Die App findet automatisch deine HCU und füllt das Feld aus

#### 3.3 Token generieren

1. Scrolle zum **"Token-Generator-Wizard"**
2. Klicke auf **"Wizard öffnen"**
3. Gib den **6-stelligen Aktivierungsschlüssel** aus der HCU-Einrichtung (Schritt 2) ein
4. Klicke auf **"Token generieren"**
5. Das Auth Token wird automatisch in die Konfiguration übernommen

#### 3.4 Speichern

1. Klicke auf **"Verbindung testen"** (optional, zur Kontrolle)
2. Klicke auf **"Speichern"**
3. ✅ Fertig! Die App ist jetzt mit der HCU verbunden

---

## 📱 Geräte hinzufügen

### Geräte zu Homey hinzufügen

1. In der Homey App: **Geräte** → **+ Gerät hinzufügen**
2. Wähle **"Homematic IP (Connect API)"**
3. Wähle den **Gerätetyp**:
   - 💡 **Schalter** (Steckdosen, Schaltaktoren)
   - 🔆 **Dimmer** (Dimmbare Lichter)
   - 🌡️ **Thermostate** (Heizkörper-, Wandthermostate)
   - 📊 **Sensoren** (Temperatur, Luftfeuchte, Bewegung)
   - 🚪 **Tür-/Fensterkontakte**
   - 🎚️ **Rollläden/Jalousien**
   - 🎛️ **Wandtaster/Fernbedienungen**
4. Wähle deine **Geräte aus der Liste**
5. Klicke **"Hinzufügen"**

---

## 🎯 Erste Schritte

### Gerät testen

1. Gehe zu **Geräte**
2. Tippe auf dein neu hinzugefügtes Gerät
3. Schalte es **Ein/Aus** oder ändere die Einstellungen

### Ersten Flow erstellen

**Beispiel: Licht bei Bewegung einschalten**

1. **Flows** → **+ Neuer Flow**
2. **WENN**: Bewegungsmelder → Bewegung erkannt
3. **DANN**: Steckdose → Einschalten
4. **Speichern**

---

## ❓ Häufige Fragen

### Die App findet meine HCU nicht

**Mögliche Lösungen:**
- Prüfe, ob du die **letzten 4 Zeichen** der SGTIN korrekt eingegeben hast
- Stelle sicher, dass **HCU und Homey im gleichen Netzwerk** sind
- Nutze die **IP-Adresse** direkt (findest du im Router)

### "Token-Generierung fehlgeschlagen"

**Mögliche Ursachen:**
- Aktivierungsschlüssel ist **abgelaufen** (nach 10 Min.) → Neuen generieren
- Developer Mode ist **nicht aktiviert** → Schritt 2.2 wiederholen
- WebSocket ist **nicht freigegeben** → In HCU-Settings prüfen

### Keine Geräte werden angezeigt

- **Verbindung testen** in den App-Settings
- Prüfe, ob Geräte in der **Homematic IP App** (Smartphone) sichtbar sind
- HCU neu starten (Stecker ziehen, 10 Sek. warten)

### Geräte reagieren nicht

- Prüfe **Batteriestatus** (bei batteriebetriebenen Geräten)
- Teste Gerät in der **Homematic IP App**
- Entferne Gerät in Homey und füge es erneut hinzu

---

## 💡 Tipps

### Feature-Tour nutzen

Klicke in den App-Settings auf **"Tour starten"** für eine geführte Einrichtung!

### Entwickler Mode deaktivieren?

Der Developer Mode **kann aktiv bleiben** - er beeinträchtigt die normale Funktion der HCU nicht. Nur wenn du ihn nicht mehr benötigst, kannst du ihn in den HCU-Einstellungen deaktivieren.

### Mehrere Homeys?

Jedes Homey benötigt eine **eigene Token-Generierung**. Die HCU unterstützt mehrere gleichzeitige Verbindungen.

