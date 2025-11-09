import { HomematicDevice } from '../../lib/HomematicDevice';

/**
 * Device-Klasse für Homematic IP Fernbedienungen und Wandtaster
 * Unterstützt: HMIP-RC8, HMIP-WRC2, HMIP-WRCD, etc.
 */
class HomematicRemoteDevice extends HomematicDevice {
  private buttonFlowCards: Map<string, any> = new Map();

  async onInit(): Promise<void> {
    await super.onInit();
    
    // Registriere Flow-Trigger für Tastendrücke
    this.registerButtonFlowCards();
    
    this.log('🎛️  Remote/Button-Gerät initialisiert');
  }

  protected registerCapabilityListeners(): void {
    // Remote-Geräte haben keine steuerbaren Capabilities
    // Sie senden nur Events
  }

  protected registerButtonFlowCards(): void {
    const buttonCount = this.getSetting('buttonCount') || 2;
    
    // Flow-Trigger für jeden Button
    for (let i = 1; i <= buttonCount; i++) {
      const triggerId = `button_${i}_pressed`;
      
      try {
        const trigger = this.homey.flow.getDeviceTriggerCard(triggerId);
        this.buttonFlowCards.set(triggerId, trigger);
        this.log(`✅ Flow-Trigger registriert: ${triggerId}`);
      } catch (error) {
        // Flow-Karte existiert noch nicht
        this.log(`⚠️  Flow-Trigger nicht verfügbar: ${triggerId}`);
      }
    }
  }

  protected updateFromDeviceData(deviceData: any): void {
    try {
      // Suche nach allen Button-Channels in functionalChannels
      if (!deviceData.functionalChannels) return;

      for (const channelKey in deviceData.functionalChannels) {
        const channel = deviceData.functionalChannels[channelKey];
        
        if (channel.functionalChannelType === 'KEY_TRANSCEIVER_CHANNEL' ||
            channel.functionalChannelType === 'MULTI_MODE_INPUT_CHANNEL') {
          
          // Check für neue Events
          if (channel.eventCounter !== undefined) {
            this.log(`🔘 Button Channel ${channel.channelIndex} - Event Counter: ${channel.eventCounter}`);
          }
        }
      }

      // Batteriestatus (falls vorhanden)
      const deviceChannel = deviceData.functionalChannels?.['0'];
      if (deviceChannel && deviceChannel.lowBat !== undefined) {
        if (this.hasCapability('alarm_battery')) {
          const currentBattery = this.getCapabilityValue('alarm_battery');
          if (deviceChannel.lowBat !== currentBattery) {
            this.setCapabilityValue('alarm_battery', deviceChannel.lowBat).catch(this.error);
            this.log(`🔋 Batterie: ${deviceChannel.lowBat ? 'Niedrig ⚠️' : 'OK'}`);
          }
        }
      }
    } catch (error) {
      this.error('❌ Fehler beim Verarbeiten der Button-Events:', error);
    }
  }

  /**
   * Verarbeitet Button-Events von der HCU
   * Wird aufgerufen wenn HMIP_SYSTEM_EVENT mit Tastendrücken kommt
   */
  handleButtonEvent(event: any): void {
    this.log(`🔘 Button-Event: Kanal ${event.channelIndex}, Typ: ${event.eventType}`);

    // Trigger Flow-Karten
    const tokens = {
      button: String(event.channelIndex),
      press_type: event.eventType, // SHORT_PRESS, LONG_PRESS, etc.
    };

    const state = {
      press_type: event.eventType
    };

    try {
      // Trigger spezifischen Button-Flow
      const triggerId = `button_${event.channelIndex}_pressed`;
      if (this.buttonFlowCards.has(triggerId)) {
        this.buttonFlowCards.get(triggerId).trigger(this, tokens, state)
          .catch((err: any) => this.error('Flow-Trigger-Fehler:', err));
      }

      // Trigger generischen Button-Flow
      this.homey.flow.getDeviceTriggerCard('button_pressed')
        .trigger(this, tokens, state)
        .catch((err: any) => this.log('Generischer Flow nicht verfügbar'));
    } catch (error) {
      this.error('❌ Fehler beim Triggern der Flows:', error);
    }
  }

  /**
   * Wird von WebSocket-Updates aufgerufen
   */
  protected handleDeviceUpdate(deviceData: any): void {
    // Bei Remote-Geräten primär auf Events achten
    super.handleDeviceUpdate(deviceData);
  }
}

module.exports = HomematicRemoteDevice;

