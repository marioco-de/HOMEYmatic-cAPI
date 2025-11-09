import { HomematicDevice } from '../../lib/HomematicDevice';

/**
 * Device-Klasse für Homematic IP Schalter
 * Unterstützt: HMIP-PS, HMIP-PSM, etc.
 */
class HomematicSwitchDevice extends HomematicDevice {
  /**
   * Registriert Listener für Capabilities
   */
  protected registerCapabilityListeners(): void {
    // onoff Capability
    this.registerCapabilityListener('onoff', async (value: boolean) => {
      this.log(`💡 Schalte ${value ? 'EIN' : 'AUS'}`);
      
      try {
        // Nutze setSwitchState aus Connect API
        await this.api.setSwitchState(this.deviceId, this.channelIndex, value);
        return true;
      } catch (error) {
        this.error('❌ Fehler beim Schalten:', error);
        throw error;
      }
    });
  }

  /**
   * Aktualisiert Capabilities basierend auf Device-Daten von HCU
   */
  protected updateFromDeviceData(deviceData: any): void {
    try {
      // Finde den Switch-Channel
      const channel = this.findChannel(deviceData, 'SWITCH_CHANNEL');

      if (channel) {
        // on-State aktualisieren
        if (channel.on !== undefined) {
          const currentValue = this.getCapabilityValue('onoff');
          if (channel.on !== currentValue) {
            this.setCapabilityValue('onoff', channel.on).catch(this.error);
            this.log(`🔄 Status aktualisiert: ${channel.on ? 'EIN' : 'AUS'}`);
          }
        }
      }
    } catch (error) {
      this.error('❌ Fehler beim Aktualisieren:', error);
    }
  }

  /**
   * Schaltet das Gerät ein (für Flow-Karten)
   */
  async turnOn(): Promise<void> {
    await this.setCapabilityValue('onoff', true);
  }

  /**
   * Schaltet das Gerät aus (für Flow-Karten)
   */
  async turnOff(): Promise<void> {
    await this.setCapabilityValue('onoff', false);
  }
}

module.exports = HomematicSwitchDevice;

