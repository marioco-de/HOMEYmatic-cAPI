import { HomematicDevice } from '../../lib/HomematicDevice';

/**
 * Device-Klasse für Homematic IP Sensoren
 * Unterstützt: HMIP-STH, HMIP-STHD, HMIP-WTH, HMIP-STHO, etc.
 */
class HomematicSensorDevice extends HomematicDevice {
  protected registerCapabilityListeners(): void {
    // Sensoren haben keine steuerbaren Capabilities
    // Sie senden nur Daten
  }

  protected updateFromDeviceData(deviceData: any): void {
    try {
      const channel = this.findChannel(deviceData, 'CLIMATE_SENSOR_CHANNEL') ||
                      this.findChannel(deviceData, 'WEATHER_SENSOR_CHANNEL') ||
                      this.findChannel(deviceData, 'ANALOG_INPUT_CHANNEL');

      if (channel) {
        // Temperatur
        if (channel.actualTemperature !== undefined || channel.temperature !== undefined) {
          const temp = channel.actualTemperature || channel.temperature;
          const currentTemp = this.getCapabilityValue('measure_temperature');
          if (Math.abs(temp - currentTemp) > 0.1) {
            this.setCapabilityValue('measure_temperature', temp).catch(this.error);
            this.log(`🌡️  Temperatur: ${temp}°C`);
          }
        }

        // Luftfeuchtigkeit
        if (channel.humidity !== undefined) {
          const currentHumidity = this.getCapabilityValue('measure_humidity');
          if (Math.abs(channel.humidity - currentHumidity) > 1) {
            this.setCapabilityValue('measure_humidity', channel.humidity).catch(this.error);
            this.log(`💧 Luftfeuchtigkeit: ${channel.humidity}%`);
          }
        }

        // Luftdruck (falls vorhanden)
        if (channel.barometricPressure !== undefined) {
          if (this.hasCapability('measure_pressure')) {
            const currentPressure = this.getCapabilityValue('measure_pressure');
            if (Math.abs(channel.barometricPressure - currentPressure) > 1) {
              this.setCapabilityValue('measure_pressure', channel.barometricPressure).catch(this.error);
              this.log(`🌤️  Luftdruck: ${channel.barometricPressure} hPa`);
            }
          }
        }

        // Batteriestatus
        if (channel.lowBat !== undefined) {
          if (this.hasCapability('alarm_battery')) {
            const currentBattery = this.getCapabilityValue('alarm_battery');
            if (channel.lowBat !== currentBattery) {
              this.setCapabilityValue('alarm_battery', channel.lowBat).catch(this.error);
              this.log(`🔋 Batterie: ${channel.lowBat ? 'Niedrig' : 'OK'}`);
            }
          }
        }
      }
    } catch (error) {
      this.error('❌ Fehler beim Aktualisieren:', error);
    }
  }
}

module.exports = HomematicSensorDevice;

