import { HomematicDevice } from '../../lib/HomematicDevice';

/**
 * Device-Klasse für Homematic IP Tür-/Fensterkontakte
 * Unterstützt: HMIP-SWDO, HMIP-SWDM, HMIP-SRH, etc.
 */
class HomematicContactDevice extends HomematicDevice {
  protected registerCapabilityListeners(): void {
    // Kontaktsensoren sind nur lesend, keine Steuerung
  }

  protected updateFromDeviceData(deviceData: any): void {
    try {
      const channel = this.findChannel(deviceData, 'SHUTTER_CONTACT') ||
                      this.findChannel(deviceData, 'ROTARY_HANDLE_SENSOR_CHANNEL') ||
                      this.findChannel(deviceData, 'CONTACT_INTERFACE_CHANNEL');

      if (channel) {
        // Hauptstatus: Offen/Geschlossen
        if (channel.windowState !== undefined) {
          // windowState: 'OPEN', 'TILTED', 'CLOSED'
          const isOpen = channel.windowState !== 'CLOSED';
          const currentOpen = this.getCapabilityValue('alarm_contact');
          if (isOpen !== currentOpen) {
            this.setCapabilityValue('alarm_contact', isOpen).catch(this.error);
            this.log(`🚪 Kontakt: ${channel.windowState}`);
          }
        } else if (channel.open !== undefined) {
          // Einfacher Kontakt: open (true/false)
          const currentOpen = this.getCapabilityValue('alarm_contact');
          if (channel.open !== currentOpen) {
            this.setCapabilityValue('alarm_contact', channel.open).catch(this.error);
            this.log(`🚪 Kontakt: ${channel.open ? 'Offen' : 'Geschlossen'}`);
          }
        }

        // Batteriestatus
        if (channel.lowBat !== undefined) {
          if (this.hasCapability('alarm_battery')) {
            const currentBattery = this.getCapabilityValue('alarm_battery');
            if (channel.lowBat !== currentBattery) {
              this.setCapabilityValue('alarm_battery', channel.lowBat).catch(this.error);
              this.log(`🔋 Batterie: ${channel.lowBat ? 'Niedrig ⚠️' : 'OK'}`);
            }
          }
        }

        // Sabotage-Alarm
        if (channel.sabotage !== undefined) {
          if (this.hasCapability('alarm_tamper')) {
            const currentTamper = this.getCapabilityValue('alarm_tamper');
            if (channel.sabotage !== currentTamper) {
              this.setCapabilityValue('alarm_tamper', channel.sabotage).catch(this.error);
              if (channel.sabotage) {
                this.log('⚠️🚨 SABOTAGE-ALARM ausgelöst!');
              }
            }
          }
        }
      }
    } catch (error) {
      this.error('❌ Fehler beim Aktualisieren:', error);
    }
  }
}

module.exports = HomematicContactDevice;

