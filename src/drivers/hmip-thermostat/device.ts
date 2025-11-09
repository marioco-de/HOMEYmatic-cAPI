import { HomematicDevice } from '../../lib/HomematicDevice';

/**
 * Device-Klasse für Homematic IP Thermostaten
 * Unterstützt: HMIP-eTRV, HMIP-WTH, HMIP-STHD, etc.
 */
class HomematicThermostatDevice extends HomematicDevice {
  protected registerCapabilityListeners(): void {
    // target_temperature Capability
    this.registerCapabilityListener('target_temperature', async (value: number) => {
      this.log(`🌡️  Setze Zieltemperatur auf ${value}°C`);
      
      try {
        await this.api.setSetPointTemperature(this.deviceId, this.channelIndex, value);
      } catch (error) {
        this.error('❌ Fehler beim Setzen der Zieltemperatur:', error);
        throw error;
      }
    });
  }

  protected updateFromDeviceData(deviceData: any): void {
    try {
      const channel = this.findChannel(deviceData, 'HEATING_THERMOSTAT_CHANNEL') ||
                      this.findChannel(deviceData, 'WALL_MOUNTED_THERMOSTAT_CHANNEL');

      if (channel) {
        // Aktuelle Temperatur
        if (channel.actualTemperature !== undefined) {
          const currentTemp = this.getCapabilityValue('measure_temperature');
          if (Math.abs(channel.actualTemperature - currentTemp) > 0.1) {
            this.setCapabilityValue('measure_temperature', channel.actualTemperature).catch(this.error);
            this.log(`🔄 Aktuelle Temperatur: ${channel.actualTemperature}°C`);
          }
        }

        // Zieltemperatur
        if (channel.setPointTemperature !== undefined) {
          const targetTemp = this.getCapabilityValue('target_temperature');
          if (Math.abs(channel.setPointTemperature - targetTemp) > 0.1) {
            this.setCapabilityValue('target_temperature', channel.setPointTemperature).catch(this.error);
            this.log(`🔄 Zieltemperatur: ${channel.setPointTemperature}°C`);
          }
        }

        // Luftfeuchtigkeit (falls vorhanden)
        if (channel.humidity !== undefined) {
          if (this.hasCapability('measure_humidity')) {
            const humidity = this.getCapabilityValue('measure_humidity');
            if (Math.abs(channel.humidity - humidity) > 1) {
              this.setCapabilityValue('measure_humidity', channel.humidity).catch(this.error);
              this.log(`🔄 Luftfeuchtigkeit: ${channel.humidity}%`);
            }
          }
        }

        // Ventilposition (für Heizkörperthermostate)
        if (channel.valvePosition !== undefined) {
          this.log(`🎚️  Ventilposition: ${Math.round(channel.valvePosition * 100)}%`);
        }

        // Heizmodus
        if (channel.controlMode !== undefined) {
          this.log(`🔧 Modus: ${channel.controlMode}`);
        }
      }
    } catch (error) {
      this.error('❌ Fehler beim Aktualisieren:', error);
    }
  }
}

module.exports = HomematicThermostatDevice;

