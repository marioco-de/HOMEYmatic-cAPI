const Homey = require('homey');
import { HomematicConnectAPI } from '../../lib/HomematicConnectAPI';
// import type HomematicApp from '../../app';

/**
 * Driver für Homematic IP Tür-/Fensterkontakte
 */
class HomematicContactDriver extends Homey.Driver {
  private api!: HomematicConnectAPI;

  async onInit(): Promise<void> {
    this.log('Homematic IP Contact Driver initialisiert');
  }

  async onPairListDevices(): Promise<any[]> {
    this.log('🔍 Liste verfügbare Tür-/Fensterkontakte...');

    try {
      const app = this.homey.app as any;
      
      if (!app || typeof app.getAPI !== 'function') {
        this.error('❌ App oder getAPI() nicht verfügbar');
        throw new Error('App ist nicht korrekt initialisiert.');
      }

      this.api = app.getAPI();
      
      if (!this.api) {
        this.error('❌ API ist nicht initialisiert');
        throw new Error('API nicht initialisiert. Bitte konfiguriere die App in den Einstellungen.');
      }

      this.log('📡 Rufe Geräte von HCU ab...');
      const devices = this.api.getDevices(); // Synchron!
      
      if (!devices || !Array.isArray(devices)) {
        this.error('❌ Keine Geräte-Array erhalten:', devices);
        throw new Error('Keine Geräte von der HCU erhalten.');
      }

      this.log(`✅ ${devices.length} Geräte von HCU erhalten`);
      
      const contactDevices = devices.filter(device => {
        const isMatch = this.isContactDevice(device);
        const icon = isMatch ? '🔘' : '⚪️';
        const status = isMatch ? 'is Contact' : 'skipped';
        this.log(`  ${icon} ${device.label || device.type} (${device.id}) [Type: ${device.type}]: ${status}`);
        return isMatch;
      });

      this.log(`🚪 ${contactDevices.length} Tür-/Fensterkontakte gefunden`);

      return contactDevices.map(device => {
        const channelIndex = this.findContactChannelIndex(device);
        this.log(`  → Pairing-Gerät: ${device.label} (Kanal ${channelIndex})`);
        
        return {
          name: device.label || device.type || 'Homematic IP Contact',
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
    } catch (error: any) {
      this.error('❌ Fehler beim Abrufen der Geräte:', error);
      throw new Error(`Fehler: ${error.message || 'Unbekannter Fehler'}`);
    }
  }

  private isContactDevice(device: any): boolean {
    const contactTypes = [
      'SHUTTER_CONTACT',
      'SHUTTER_CONTACT_MAGNETIC',
      'ROTARY_HANDLE_SENSOR',
    ];

    return contactTypes.some(type => device.type?.includes(type));
  }

  private findContactChannelIndex(device: any): number {
    if (device.functionalChannels) {
      for (const channelKey in device.functionalChannels) {
        const channel = device.functionalChannels[channelKey];
        if (channel.functionalChannelType === 'SHUTTER_CONTACT_CHANNEL' ||
            channel.functionalChannelType === 'ROTARY_HANDLE_SENSOR_CHANNEL' ||
            channel.functionalChannelType === 'CONTACT_INTERFACE_CHANNEL') {
          return channel.channelIndex || parseInt(channelKey) || 1;
        }
      }
    }
    return 1;
  }
}

module.exports = HomematicContactDriver;

