import { HomematicDevice } from '../../lib/HomematicDevice';

/**
 * Device-Klasse für Homematic IP Dimmer
 * Unterstützt: HMIP-FDT, HMIP-PDT, etc.
 */
class HomematicDimmerDevice extends HomematicDevice {
  protected registerCapabilityListeners(): void {
    // onoff Capability
    this.registerCapabilityListener('onoff', async (value: boolean) => {
      this.log(`💡 Schalte ${value ? 'EIN' : 'AUS'}`);
      
      try {
        // Setze auf 0 oder 100%
        const dimLevel = value ? 1.0 : 0.0;
        await this.api.setDimLevel(this.deviceId, this.channelIndex, dimLevel);
      } catch (error) {
        this.error('❌ Fehler beim Schalten:', error);
        throw error;
      }
    });

    // dim Capability (0.0 - 1.0)
    this.registerCapabilityListener('dim', async (value: number) => {
      this.log(`🔆 Setze Helligkeit auf ${Math.round(value * 100)}%`);
      
      try {
        await this.api.setDimLevel(this.deviceId, this.channelIndex, value);
        
        // Sync onoff state
        const shouldBeOn = value > 0;
        if (this.getCapabilityValue('onoff') !== shouldBeOn) {
          await this.setCapabilityValue('onoff', shouldBeOn);
        }
      } catch (error) {
        this.error('❌ Fehler beim Dimmen:', error);
        throw error;
      }
    });
  }

  protected updateFromDeviceData(deviceData: any): void {
    try {
      const channel = this.findChannel(deviceData, 'DIMMER_CHANNEL');

      if (channel) {
        // dim Level (0.0 - 1.0)
        if (channel.dimLevel !== undefined) {
          const currentDim = this.getCapabilityValue('dim');
          if (Math.abs(channel.dimLevel - currentDim) > 0.01) {
            this.setCapabilityValue('dim', channel.dimLevel).catch(this.error);
            this.log(`🔄 Helligkeit aktualisiert: ${Math.round(channel.dimLevel * 100)}%`);
          }
          
          // onoff Status (automatisch aus dimLevel ableiten)
          const shouldBeOn = channel.dimLevel > 0;
          const currentOn = this.getCapabilityValue('onoff');
          if (shouldBeOn !== currentOn) {
            this.setCapabilityValue('onoff', shouldBeOn).catch(this.error);
            this.log(`🔄 Status aktualisiert: ${shouldBeOn ? 'EIN' : 'AUS'}`);
          }
        }
      }
    } catch (error) {
      this.error('❌ Fehler beim Aktualisieren:', error);
    }
  }
}

module.exports = HomematicDimmerDevice;

