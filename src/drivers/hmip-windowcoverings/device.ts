import { HomematicDevice } from '../../lib/HomematicDevice';

/**
 * Device-Klasse für Homematic IP Rollläden/Jalousien
 * Unterstützt: HMIP-BROLL, HMIP-FBL, HMIP-BBL, etc.
 */
class HomematicWindowCoveringsDevice extends HomematicDevice {
  protected registerCapabilityListeners(): void {
    // windowcoverings_set - Position setzen (0 = offen, 1 = geschlossen)
    this.registerCapabilityListener('windowcoverings_set', async (value: number) => {
      this.log(`🪟 Setze Position auf ${Math.round(value * 100)}%`);
      
      try {
        // Connect API: setShutterLevel (0.0 = geschlossen, 1.0 = offen)
        // Homey: 0 = offen, 1 = geschlossen
        // WICHTIG: Werte invertieren!
        const shutterLevel = 1.0 - value;
        await this.api.setShutterLevel(this.deviceId, this.channelIndex, shutterLevel);
      } catch (error) {
        this.error('❌ Fehler beim Setzen der Position:', error);
        throw error;
      }
    });

    // windowcoverings_tilt_set - Lamellenwinkel (falls unterstützt)
    if (this.hasCapability('windowcoverings_tilt_set')) {
      this.registerCapabilityListener('windowcoverings_tilt_set', async (value: number) => {
        this.log(`🎚️  Setze Lamellenwinkel auf ${Math.round(value * 100)}%`);
        
        try {
          // TODO: API-Methode für Slats hinzufügen
          // await this.api.setSlatsLevel(this.deviceId, this.channelIndex, value);
        } catch (error) {
          this.error('❌ Fehler beim Setzen des Lamellenwinkels:', error);
          throw error;
        }
      });
    }
  }

  protected updateFromDeviceData(deviceData: any): void {
    try {
      const channel = this.findChannel(deviceData, 'BLIND_CHANNEL') || 
                      this.findChannel(deviceData, 'SHUTTER_CHANNEL');

      if (channel) {
        // Position (shutterLevel: 0.0 = geschlossen, 1.0 = offen)
        // Homey: 0 = offen, 1 = geschlossen -> invertieren!
        if (channel.shutterLevel !== undefined) {
          const homeyPosition = 1.0 - channel.shutterLevel;
          const currentValue = this.getCapabilityValue('windowcoverings_set');
          
          if (Math.abs(homeyPosition - currentValue) > 0.01) {
            this.setCapabilityValue('windowcoverings_set', homeyPosition).catch(this.error);
            this.log(`🔄 Position aktualisiert: ${Math.round(homeyPosition * 100)}%`);
          }
        }

        // Lamellenwinkel (slatsLevel)
        if (channel.slatsLevel !== undefined && this.hasCapability('windowcoverings_tilt_set')) {
          const currentTilt = this.getCapabilityValue('windowcoverings_tilt_set');
          if (Math.abs(channel.slatsLevel - currentTilt) > 0.01) {
            this.setCapabilityValue('windowcoverings_tilt_set', channel.slatsLevel).catch(this.error);
            this.log(`🔄 Lamellenwinkel aktualisiert: ${Math.round(channel.slatsLevel * 100)}%`);
          }
        }

        // Bewegungsstatus
        if (channel.processing !== undefined) {
          this.log(`🔄 Rollladen ${channel.processing ? 'bewegt sich' : 'steht still'}`);
        }
      }
    } catch (error) {
      this.error('❌ Fehler beim Aktualisieren:', error);
    }
  }

  /**
   * Hilfsmethoden für Flow-Karten
   */
  async openBlind(): Promise<void> {
    this.log('🔼 Öffne Rollladen');
    await this.setCapabilityValue('windowcoverings_set', 0);
  }

  async closeBlind(): Promise<void> {
    this.log('🔽 Schließe Rollladen');
    await this.setCapabilityValue('windowcoverings_set', 1);
  }

  async stopBlind(): Promise<void> {
    try {
      this.log('⏸️  Stoppe Rollladen');
      await this.api.setShutterStop(this.deviceId, this.channelIndex);
    } catch (error) {
      this.error('❌ Fehler beim Stoppen:', error);
      throw error;
    }
  }
}

module.exports = HomematicWindowCoveringsDevice;

