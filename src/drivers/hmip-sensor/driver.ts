const Homey = require('homey');
import { HomematicConnectAPI } from '../../lib/HomematicConnectAPI';
// import type HomematicApp from '../../app';

/**
 * Driver für Homematic IP Sensoren
 */
class HomematicSensorDriver extends Homey.Driver {
  private api!: HomematicConnectAPI;

  async onInit(): Promise<void> {
    this.log('Homematic IP Sensor Driver initialisiert');
  }

  async onPairListDevices(): Promise<any[]> {
    this.log('🔍 Liste verfügbare Sensoren...');

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
      
      const sensorDevices = devices.filter(device => {
        const isMatch = this.isSensorDevice(device);
        const icon = isMatch ? '🔘' : '⚪️';
        const status = isMatch ? 'is Sensor' : 'skipped';
        this.log(`  ${icon} ${device.label || device.type} (${device.id}) [Type: ${device.type}]: ${status}`);
        return isMatch;
      });

      this.log(`🌡️ ${sensorDevices.length} Sensoren gefunden`);

      return sensorDevices.map(device => {
        const channelIndex = this.findSensorChannelIndex(device);
        this.log(`  → Pairing-Gerät: ${device.label} (Kanal ${channelIndex})`);
        
        return {
          name: device.label || device.type || 'Homematic IP Sensor',
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

  private isSensorDevice(device: any): boolean {
    const sensorTypes = [
      'MOTION_DETECTOR',
      'WEATHER_SENSOR',
      'CLIMATE_SENSOR',
      'TEMPERATURE_HUMIDITY_SENSOR',
    ];

    return sensorTypes.some(type => device.type?.includes(type));
  }

  private findSensorChannelIndex(device: any): number {
    if (device.functionalChannels) {
      for (const channelKey in device.functionalChannels) {
        const channel = device.functionalChannels[channelKey];
        if (channel.functionalChannelType === 'CLIMATE_SENSOR_CHANNEL' ||
            channel.functionalChannelType === 'WEATHER_SENSOR_CHANNEL' ||
            channel.functionalChannelType === 'MOTION_DETECTION_CHANNEL') {
          return channel.channelIndex || parseInt(channelKey) || 1;
        }
      }
    }
    return 1;
  }
}

module.exports = HomematicSensorDriver;

