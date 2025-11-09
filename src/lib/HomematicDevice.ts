const Homey = require('homey');
import { HomematicConnectAPI } from './HomematicConnectAPI';

/**
 * Basis-Klasse für alle Homematic IP Geräte
 * Unterstützt automatische Synchronisation mit HCU über WebSocket
 */
export class HomematicDevice extends Homey.Device {
  protected api!: HomematicConnectAPI;
  protected deviceId!: string;
  protected channelIndex!: number; // Channel als Number (z.B. 1, 2, 3)
  protected updateInterval: NodeJS.Timeout | null = null;
  protected deviceUpdateListener: ((device: any) => void) | null = null;

  /**
   * Initialisiert das Gerät
   */
  async onInit(): Promise<void> {
    this.log('🔧 Gerät wird initialisiert:', this.getName());

    const app = this.homey.app as any;
    this.api = app.getAPI();

    const data = this.getData();
    this.deviceId = data.id;
    
    // Channel Index als Number
    this.channelIndex = parseInt(data.channelIndex || data.channelId || '1');

    // Registriere Capability-Listener
    this.registerCapabilityListeners();

    // Höre auf spezifische Device-Updates von der API (mit Event-Namespace)
    this.deviceUpdateListener = this.handleDeviceUpdate.bind(this);
    this.api.on(`device_update:${this.deviceId}`, this.deviceUpdateListener);

    // Initiales Laden aus Cache
    await this.updateDeviceState();

    // Periodisches Fallback-Update (alle 5 Minuten)
    this.updateInterval = setInterval(
      () => this.updateDeviceState(),
      300000
    );

    this.log('✅ Gerät erfolgreich initialisiert:', this.getName());
  }

  /**
   * Registriert Listener für Capabilities
   * Wird in Unterklassen überschrieben
   */
  protected registerCapabilityListeners(): void {
    // Override in subclasses
  }

  /**
   * Verarbeitet Device-Updates von der HCU (über WebSocket)
   */
  protected handleDeviceUpdate(deviceData: any): void {
    this.log(`🔄 Echtzeit-Update empfangen für: ${this.getName()}`);
    this.syncWithHomematicDevice(deviceData);
  }

  /**
   * Synchronisiert Homey-Gerät mit HCU-Device-Daten
   * Diese Methode wird von der App aufgerufen, wenn Updates von der HCU kommen
   */
  async syncWithHomematicDevice(hmipDevice: any): Promise<void> {
    this.updateFromDeviceData(hmipDevice);
  }

  /**
   * Aktualisiert Capabilities basierend auf Device-Daten
   * Wird in Unterklassen überschrieben
   */
  protected updateFromDeviceData(deviceData: any): void {
    // Override in subclasses
  }

  /**
   * Aktualisiert den Gerätezustand aus dem API-Cache
   */
  protected async updateDeviceState(): Promise<void> {
    try {
      const deviceData = this.api.getDevice(this.deviceId);
      if (deviceData) {
        this.updateFromDeviceData(deviceData);
      }
    } catch (error) {
      this.error('❌ Fehler beim Aktualisieren des Gerätezustands:', error);
    }
  }

  /**
   * Hilfsmethode: Findet den relevanten Channel im Device
   */
  protected findChannel(deviceData: any, functionalChannelType?: string): any | null {
    if (!deviceData.functionalChannels) {
      return null;
    }

    // Suche nach Channel mit passendem Index oder Typ
    for (const channelKey in deviceData.functionalChannels) {
      const channel = deviceData.functionalChannels[channelKey];
      
      // Match by index
      if (channel.channelIndex === this.channelIndex) {
        return channel;
      }
      
      // Match by type if specified
      if (functionalChannelType && channel.functionalChannelType === functionalChannelType) {
        return channel;
      }
    }

    return null;
  }

  /**
   * Wird aufgerufen, wenn das Gerät gelöscht wird
   */
  async onDeleted(): Promise<void> {
    this.log('🗑️  Gerät wird gelöscht:', this.getName());

    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }

    if (this.deviceUpdateListener) {
      this.api.removeListener(`device_update:${this.deviceId}`, this.deviceUpdateListener);
      this.deviceUpdateListener = null;
    }
  }

  /**
   * Wird aufgerufen, wenn Settings geändert werden
   */
  async onSettings({
    oldSettings,
    newSettings,
    changedKeys,
  }: {
    oldSettings: any;
    newSettings: any;
    changedKeys: string[];
  }): Promise<string | void> {
    this.log('⚙️  Einstellungen wurden geändert:', changedKeys);
  }
}

