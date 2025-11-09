const Homey = require('homey');
import { HomematicConnectAPI } from '../../lib/HomematicConnectAPI';
// import type HomematicApp from '../../app';

/**
 * Driver für Homematic IP Thermostaten
 */
class HomematicThermostatDriver extends Homey.Driver {
  private api!: HomematicConnectAPI;

  async onInit(): Promise<void> {
    this.log('Homematic IP Thermostat Driver initialisiert');
  }

  async onPairListDevices(): Promise<any[]> {
    this.log('🔍 Liste verfügbare Thermostate...');

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
      
      const thermostatDevices = devices.filter(device => {
        const isMatch = this.isThermostatDevice(device);
        const icon = isMatch ? '🔘' : '⚪️';
        const status = isMatch ? 'is Thermostat' : 'skipped';
        this.log(`  ${icon} ${device.label || device.type} (${device.id}) [Type: ${device.type}]: ${status}`);
        return isMatch;
      });

      this.log(`🌡️ ${thermostatDevices.length} Thermostate gefunden`);

      return thermostatDevices.map(device => {
        const channelIndex = this.findThermostatChannelIndex(device);
        this.log(`  → Pairing-Gerät: ${device.label} (Kanal ${channelIndex})`);
        
        return {
          name: device.label || device.type || 'Homematic IP Thermostat',
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

  private isThermostatDevice(device: any): boolean {
    const thermostatTypes = [
      'HEATING_THERMOSTAT',
      'WALL_MOUNTED_THERMOSTAT',
    ];

    return thermostatTypes.includes(device.type);
  }

  private findThermostatChannelIndex(device: any): number {
    if (device.functionalChannels) {
      for (const channelKey in device.functionalChannels) {
        const channel = device.functionalChannels[channelKey];
        if (channel.functionalChannelType === 'HEATING_THERMOSTAT_CHANNEL' ||
            channel.functionalChannelType === 'WALL_MOUNTED_THERMOSTAT_CHANNEL') {
          return channel.channelIndex || parseInt(channelKey) || 1;
        }
      }
    }
    return 1;
  }
}

module.exports = HomematicThermostatDriver;

