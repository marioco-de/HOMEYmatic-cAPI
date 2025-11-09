const Homey = require('homey');
import { HomematicConnectAPI } from '../../lib/HomematicConnectAPI';
// import type HomematicApp from '../../app';

/**
 * Driver für Homematic IP Fernbedienungen und Wandtaster
 */
class HomematicRemoteDriver extends Homey.Driver {
  private api!: HomematicConnectAPI;

  async onInit(): Promise<void> {
    this.log('Homematic IP Remote Driver initialisiert');
  }

  async onPairListDevices(): Promise<any[]> {
    this.log('🔍 Liste verfügbare Fernbedienungen/Taster...');

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
      
      const remoteDevices = devices.filter(device => {
        const isMatch = this.isRemoteDevice(device);
        const icon = isMatch ? '🔘' : '⚪️';
        const status = isMatch ? 'is Remote' : 'skipped';
        this.log(`  ${icon} ${device.label || device.type} (${device.id}) [Type: ${device.type}]: ${status}`);
        return isMatch;
      });

      this.log(`🎮 ${remoteDevices.length} Fernbedienungen/Taster gefunden`);

      return remoteDevices.map(device => {
        this.log(`  → Pairing-Gerät: ${device.label} (Kanal 0)`);
        
        return {
          name: device.label || device.type || 'Homematic IP Remote',
          data: {
            id: device.id,
            channelIndex: 0, // Remote-Geräte nutzen Channel 0 für Events
          },
          settings: {
            deviceType: device.type || 'Unknown',
            modelType: device.modelType || 'Unknown',
            buttonCount: this.getButtonCount(device.type),
          },
        };
      });
    } catch (error: any) {
      this.error('❌ Fehler beim Abrufen der Geräte:', error);
      throw new Error(`Fehler: ${error.message || 'Unbekannter Fehler'}`);
    }
  }

  private isRemoteDevice(device: any): boolean {
    const remoteTypes = [
      'PUSH_BUTTON',
      'REMOTE',
      'WALL_MOUNTED_REMOTE',
    ];

    return remoteTypes.some(type => device.type?.includes(type));
  }

  private getButtonCount(deviceType: string): number {
    if (deviceType?.includes('WRC2') || deviceType?.includes('PB-2')) return 2;
    if (deviceType?.includes('WRC6') || deviceType?.includes('PB-6')) return 6;
    if (deviceType?.includes('RC8') || deviceType?.includes('PB-4')) return 8;
    if (deviceType?.includes('RC-4') || deviceType?.includes('Key4')) return 4;
    return 2; // Default
  }
}

module.exports = HomematicRemoteDriver;

