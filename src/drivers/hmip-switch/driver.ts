const Homey = require('homey');
import { HomematicConnectAPI } from '../../lib/HomematicConnectAPI';
// import type HomematicApp from '../../app';

/**
 * Driver für Homematic IP Schalter
 */
class HomematicSwitchDriver extends Homey.Driver {
  private api!: HomematicConnectAPI;

  /**
   * Initialisiert den Driver
   */
  async onInit(): Promise<void> {
    this.log('Homematic IP Switch Driver initialisiert');
  }

  /**
   * Wird während des Pairings aufgerufen, um verfügbare Geräte zu listen
   */
  async onPairListDevices(): Promise<any[]> {
    this.log('🔍 Liste verfügbare Schaltgeräte...');

    try {
      const app = this.homey.app as any;
      
      // Prüfe ob API verfügbar ist
      if (!app || typeof app.getAPI !== 'function') {
        this.error('❌ App oder getAPI() nicht verfügbar');
        throw new Error('App ist nicht korrekt initialisiert. Bitte starte die App neu.');
      }

      this.api = app.getAPI();
      
      if (!this.api) {
        this.error('❌ API ist nicht initialisiert');
        throw new Error('API nicht initialisiert. Bitte konfiguriere die App in den Einstellungen (HCU Host + Auth Token).');
      }

      this.log('📡 Rufe Geräte von HCU ab...');
      const devices = this.api.getDevices();
      
      if (!devices || !Array.isArray(devices)) {
        this.error('❌ Keine Geräte-Array erhalten:', devices);
        throw new Error('Keine Geräte von der HCU erhalten. Ist die Verbindung hergestellt?');
      }

      this.log(`✅ ${devices.length} Geräte von HCU erhalten`);
      
      // Filtere nur Schaltgeräte
      const switchDevices = devices.filter(device => {
        const isSwitch = this.isSwitchDevice(device);
        const icon = isSwitch ? '🔘' : '⚪️';
        const status = isSwitch ? 'is Switch' : 'skipped';
        this.log(`  ${icon} ${device.label || device.type} (${device.id}) [Type: ${device.type}]: ${status}`);
        return isSwitch;
      });

      this.log(`🔌 ${switchDevices.length} Schaltgeräte gefunden`);

      if (switchDevices.length === 0) {
        this.log('⚠️  Keine Schaltgeräte gefunden. Verfügbare Gerätetypen:', 
          devices.map(d => d.type).join(', '));
      }

      const pairDevices = switchDevices.map(device => {
        const channelIndex = this.findSwitchChannelIndex(device);
        this.log(`  → Pairing-Gerät: ${device.label} (Kanal ${channelIndex})`);
        
        return {
          name: device.label || device.type || 'Homematic IP Switch',
          data: {
            id: device.id,
            channelIndex: channelIndex,
          },
          settings: {
            deviceType: device.type || 'Unknown',
            modelType: device.modelType || 'Unknown',
          },
        };
      });

      return pairDevices;
    } catch (error: any) {
      this.error('❌ Fehler beim Abrufen der Geräte:', error);
      throw new Error(`Fehler: ${error.message || 'Unbekannter Fehler'}. Prüfe die App-Logs.`);
    }
  }

  /**
   * Prüft, ob ein Gerät ein Schaltgerät ist
   */
  private isSwitchDevice(device: any): boolean {
    const switchTypes = [
      'PLUGABLE_SWITCH',
      'BRAND_SWITCH',
      'WIRED_SWITCH',
      'SWITCH',
    ];

    return switchTypes.some(type => device.type?.includes(type));
  }

  /**
   * Findet den Schalt-Kanal-Index eines Geräts (als Number)
   */
  private findSwitchChannelIndex(device: any): number {
    // Die meisten Schaltgeräte verwenden Kanal 1
    // functionalChannels ist ein Object mit keys wie "0", "1", etc.
    if (device.functionalChannels) {
      for (const channelKey in device.functionalChannels) {
        const channel = device.functionalChannels[channelKey];
        if (channel.functionalChannelType === 'SWITCH_CHANNEL') {
          return channel.channelIndex || parseInt(channelKey) || 1;
        }
      }
    }
    return 1; // Default: Kanal 1
  }
}

module.exports = HomematicSwitchDriver;

