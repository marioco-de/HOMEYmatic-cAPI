const Homey = require('homey');
import { HomematicConnectAPI } from './lib/HomematicConnectAPI';

/**
 * Hauptklasse der Homematic IP Connect App für Homey
 */
class HomematicApp extends Homey.App {
  private api!: HomematicConnectAPI;

  /**
   * App-Initialisierung beim Start
   */
  async onInit(): Promise<void> {
    this.log('Homematic IP Connect App wird initialisiert...');

    try {
      // API-Client initialisieren (wird nicht werfen, auch wenn HCU nicht erreichbar)
      await this.initializeAPI();

      // Flow-Karten registrieren
      this.registerFlowCards();

      this.log('Homematic IP Connect App erfolgreich gestartet!');
    } catch (error) {
      this.error('Fehler beim Initialisieren der App:', error);
      // App läuft trotzdem weiter
    }
  }

  /**
   * Initialisiert den Homematic IP Connect API Client
   * WICHTIG: Verbindet NICHT automatisch! Verbindung wird erst hergestellt,
   * wenn Nutzer explizit speichert oder testet in den Settings.
   */
  private async initializeAPI(): Promise<void> {
    const hcuHost = this.homey.settings.get('hcuHost');
    const authToken = this.homey.settings.get('authToken');
    const pluginId = this.homey.settings.get('pluginId') || 'de.maricode.homeymatic.capi';

    // Prüfe ob die Einstellungen vorhanden sind
    if (hcuHost && authToken) {
      this.log('📋 HCU-Konfiguration gefunden');
      this.log(`   Host: ${hcuHost}`);
      this.log(`   Plugin-ID: ${pluginId}`);
      
      // API-Client erstellen, aber NICHT verbinden
      // Verbindung wird nur hergestellt, wenn explizit über Settings getriggert
      this.api = new HomematicConnectAPI(
        hcuHost,
        authToken,
        pluginId,
        this.log.bind(this),
        this.error.bind(this)
      );
      
      this.log('⚠️  API-Client bereit, aber nicht verbunden');
      this.log('💡 Verbindung wird hergestellt wenn Sie in den Settings auf "Speichern" klicken');
    } else {
      this.log('⚠️  Keine HCU-Konfiguration gefunden');
      this.log('💡 Bitte konfigurieren Sie die App über die Settings-Seite');
    }
  }

  /**
   * Registriert Event-Listener für Device-Updates von der HCU
   * Synchronisiert Status-Änderungen mit Homey-Geräten
   */
  private setupDeviceUpdateListeners(): void {
    if (!this.api) return;

    // Lausche auf alle Device-Updates
    this.api.on('device_update', (device: any) => {
      this.log(`🔄 Device Update empfangen: ${device.id}`);
      this.updateHomeyDevice(device);
    });

    // Lausche auf System State geladen
    this.api.on('system_state_loaded', (state: any) => {
      this.log(`✅ System State geladen mit ${state.devices?.length || 0} Geräten`);
    });

    // Lausche auf Verbindungsfehler
    this.api.on('connection_failed', () => {
      this.error('❌ Verbindung zur HCU fehlgeschlagen nach mehreren Versuchen');
    });
  }

  /**
   * Aktualisiert ein Homey-Gerät mit neuen Daten von der HCU
   */
  private async updateHomeyDevice(hmipDevice: any): Promise<void> {
    try {
      // Finde das entsprechende Homey-Gerät
      const drivers = this.homey.drivers.getDrivers();
      
      for (const driverId in drivers) {
        const driver = drivers[driverId];
        const devices = driver.getDevices();
        
        for (const device of devices) {
          // Prüfe ob die Device-ID übereinstimmt
          const deviceData = device.getData();
          if (deviceData.id === hmipDevice.id) {
            this.log(`🔄 Aktualisiere Homey-Gerät: ${device.getName()}`);
            
            // Rufe syncWithHomematicDevice auf, falls vorhanden
            if (typeof device.syncWithHomematicDevice === 'function') {
              await device.syncWithHomematicDevice(hmipDevice);
            }
            
            return;
          }
        }
      }
    } catch (error) {
      this.error('Fehler beim Aktualisieren von Homey-Gerät:', error);
    }
  }

  /**
   * Registriert Flow-Karten
   */
  private registerFlowCards(): void {
    // Action Flow Card: Gerät einschalten
    const turnOnAction = this.homey.flow.getActionCard('turn_on_device');
    turnOnAction.registerRunListener(async (args: any) => {
      await args.device.turnOn();
      return true;
    });

    // Action Flow Cards: Rollläden
    const openBlindsAction = this.homey.flow.getActionCard('open_blinds');
    openBlindsAction.registerRunListener(async (args: any) => {
      await args.device.openBlind();
      return true;
    });

    const closeBlindsAction = this.homey.flow.getActionCard('close_blinds');
    closeBlindsAction.registerRunListener(async (args: any) => {
      await args.device.closeBlind();
      return true;
    });

    const stopBlindsAction = this.homey.flow.getActionCard('stop_blinds');
    stopBlindsAction.registerRunListener(async (args: any) => {
      await args.device.stopBlind();
      return true;
    });

    const setBlindsPositionAction = this.homey.flow.getActionCard('set_blinds_position');
    setBlindsPositionAction.registerRunListener(async (args: any) => {
      const position = args.position / 100; // Konvertiere % zu 0-1
      await args.device.setCapabilityValue('windowcoverings_set', position);
      return true;
    });
  }

  /**
   * Gibt den API-Client zurück
   */
  getAPI(): HomematicConnectAPI {
    if (!this.api) {
      throw new Error('API noch nicht initialisiert. Bitte konfigurieren Sie die App über die Settings-Seite.');
    }
    return this.api;
  }

  /**
   * Aktualisiert die API-Konfiguration und stellt Verbindung her
   */
  async updateAPIConfig(
    hcuHost: string,
    authToken: string,
    pluginId?: string
  ): Promise<void> {
    this.log('🔄 Aktualisiere API-Konfiguration...');
    
    this.homey.settings.set('hcuHost', hcuHost);
    this.homey.settings.set('authToken', authToken);
    if (pluginId) {
      this.homey.settings.set('pluginId', pluginId);
    }

    // Alte Verbindung trennen
    if (this.api) {
      this.log('🔌 Trenne alte Verbindung...');
      await this.api.disconnect();
    }

    // Neue API-Instanz erstellen
    this.api = new HomematicConnectAPI(
      hcuHost,
      authToken,
      pluginId || 'de.maricode.homeymatic.capi',
      this.log.bind(this),
      this.error.bind(this)
    );

    // Explizit verbinden
    this.log('🔗 Stelle neue Verbindung her...');
    await this.api.connect();
    this.log('✅ Verbindung zur Homematic IP Connect API hergestellt');
    
    // Event-Listener für Device-Updates registrieren
    this.setupDeviceUpdateListeners();
  }

  /**
   * Wird aufgerufen, wenn die App beendet wird
   */
  async onUninit(): Promise<void> {
    this.log('Homematic IP Connect App wird beendet...');
    if (this.api) {
      await this.api.disconnect();
    }
  }
}

module.exports = HomematicApp;

