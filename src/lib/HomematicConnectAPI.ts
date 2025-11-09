import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { v4 as uuidv4 } from 'uuid';
import https from 'https';

/**
 * WebSocket Message Strukturen gemäß Connect API Dokumentation
 */
interface PluginMessage {
  pluginId: string;
  id: string;
  type: string;
  body: any;
}

interface HmipSystemRequest {
  path: string;
  body?: any;
}

interface HmipSystemResponse {
  path: string;
  body: any;
  errorCode?: string;
}

/**
 * Client für die Homematic IP Connect API
 * Implementiert die offizielle Connect API über WebSocket (Port 9001)
 * Basiert auf connect-api-documentation-1.0.1.html
 */
export class HomematicConnectAPI extends EventEmitter {
  private ws: WebSocket | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 10;
  private pingInterval: NodeJS.Timeout | null = null;
  
  // System State Cache
  private systemState: any = null;
  private devices: Map<string, any> = new Map();
  private groups: Map<string, any> = new Map();
  
  // Pending Requests für Request/Response Matching
  private pendingRequests: Map<string, {
    resolve: (value: any) => void;
    reject: (reason: any) => void;
    timeout: NodeJS.Timeout;
  }> = new Map();

  constructor(
    private hcuHost: string, // z.B. "hcu1-1234.local" oder "192.168.1.100"
    private authToken: string,
    private pluginId: string, // z.B. "de.homematic.homey.plugin"
    private logger: (message: string, ...args: any[]) => void = console.log,
    private errorLogger: (message: string, ...args: any[]) => void = console.error
  ) {
    super();
  }

  /**
   * Verbindet zur Homematic IP Connect API WebSocket
   */
  async connect(): Promise<void> {
    try {
      await this.connectWebSocket();
      
      // Initial System State laden
      await this.loadSystemState();
      
      // Ping-Intervall starten für Keep-Alive
      this.startPingInterval();
      
      this.logger('✅ Erfolgreich mit Homematic IP Connect API verbunden');
    } catch (error) {
      this.errorLogger('❌ Fehler beim Verbinden zur API:', error);
      throw error;
    }
  }

  /**
   * Stellt WebSocket-Verbindung her gemäß Connect API Spezifikation
   * URL: wss://hcu1-XXXX.local:9001
   * Headers: authtoken, plugin-id
   */
  private async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      const wsUrl = `wss://${this.hcuHost}:9001`;
      
      this.logger(`📡 Verbinde zu WebSocket: ${wsUrl}`);
      
      // Connection Timeout (15 Sekunden)
      const connectionTimeout = setTimeout(() => {
        if (this.ws) {
          this.ws.terminate();
        }
        reject(new Error('Connection timeout - HCU nicht erreichbar'));
      }, 15000);
      
      // WebSocket mit korrekten Headers gemäß Dokumentation
      this.ws = new WebSocket(wsUrl, {
        rejectUnauthorized: false, // Self-signed certificate der HCU
        headers: {
          'authtoken': this.authToken,      // KLEINGESCHRIEBEN!
          'plugin-id': this.pluginId
        },
        handshakeTimeout: 10000 // WebSocket handshake timeout
      });

      this.ws.on('open', () => {
        clearTimeout(connectionTimeout);
        this.logger('✅ WebSocket-Verbindung hergestellt');
        this.reconnectAttempts = 0;
        
        // Sende Plugin Ready Status
        this.sendPluginStateResponse('READY');
        
        resolve();
      });

      this.ws.on('message', (data: WebSocket.Data) => {
        try {
          const message: PluginMessage = JSON.parse(data.toString());
          this.handlePluginMessage(message);
        } catch (error) {
          this.errorLogger('❌ Fehler beim Parsen der WebSocket-Nachricht:', error);
        }
      });

      this.ws.on('error', (error) => {
        clearTimeout(connectionTimeout);
        this.errorLogger('❌ WebSocket-Fehler:', error);
        reject(error);
      });

      this.ws.on('close', () => {
        clearTimeout(connectionTimeout);
        this.logger('🔌 WebSocket-Verbindung geschlossen');
        this.stopPingInterval();
        this.scheduleReconnect();
      });
    });
  }

  /**
   * Verarbeitet eingehende PluginMessage
   */
  private handlePluginMessage(message: PluginMessage): void {
    this.logger(`⬅️ Plugin Message empfangen: ${message.type}`);

    switch (message.type) {
      case 'PLUGIN_STATE_REQUEST':
        // HCU fragt nach Plugin-Status
        this.sendPluginStateResponse('READY');
        break;

      case 'HMIP_SYSTEM_RESPONSE':
        // Antwort auf unsere HmipSystemRequest
        this.handleSystemResponse(message);
        break;

      case 'HMIP_SYSTEM_EVENT':
        // Echtzeit-Updates von Geräten/Gruppen
        this.handleSystemEvent(message);
        break;

      default:
        this.logger(`⚠️  Unbekannter Message Type: ${message.type}`);
    }
  }

  /**
   * Sendet Plugin State Response
   */
  private sendPluginStateResponse(status: 'READY' | 'ERROR'): void {
    const message: PluginMessage = {
      pluginId: this.pluginId,
      id: uuidv4(),
      type: 'PLUGIN_STATE_RESPONSE',
      body: {
        pluginReadinessStatus: status
      }
    };

    this.sendMessage(message);
  }

  /**
   * Sendet eine PluginMessage über WebSocket
   */
  private sendMessage(message: PluginMessage): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.errorLogger('❌ WebSocket nicht verbunden');
      return;
    }

    this.ws.send(JSON.stringify(message));
    this.logger(`➡️ Message gesendet: ${message.type}`);
  }

  /**
   * Sendet HmipSystemRequest und wartet auf Response
   */
  private async sendSystemRequest(path: string, body?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const messageId = uuidv4();
      
      const message: PluginMessage = {
        pluginId: this.pluginId,
        id: messageId,
        type: 'HMIP_SYSTEM_REQUEST',
        body: {
          path: path,
          body: body || {}
        }
      };

      // Timeout nach 30 Sekunden
      const timeout = setTimeout(() => {
        this.pendingRequests.delete(messageId);
        reject(new Error(`Request timeout für ${path}`));
      }, 30000);

      // Request registrieren
      this.pendingRequests.set(messageId, { resolve, reject, timeout });

      // Message senden
      this.sendMessage(message);
    });
  }

  /**
   * Verarbeitet HmipSystemResponse
   */
  private handleSystemResponse(message: PluginMessage): void {
    const pending = this.pendingRequests.get(message.id);
    
    if (!pending) {
      this.logger('⚠️  Keine pending request für Response gefunden');
      return;
    }

    clearTimeout(pending.timeout);
    this.pendingRequests.delete(message.id);

    const response: HmipSystemResponse = message.body;

    if (response.errorCode) {
      pending.reject(new Error(`API Error ${response.errorCode}: ${response.path}`));
    } else {
      pending.resolve(response.body);
    }
  }

  /**
   * Verarbeitet HmipSystemEvent (Echtzeit-Updates)
   */
  private handleSystemEvent(message: PluginMessage): void {
    const event = message.body;
    
    this.logger(`🔔 System Event: ${JSON.stringify(event).substring(0, 200)}`);

    // Events an Homey weiterleiten
    if (event.pushEventType) {
      switch (event.pushEventType) {
        case 'DEVICE_CHANGED':
        case 'DEVICE_ADDED':
        case 'DEVICE_REMOVED':
          this.handleDeviceEvent(event);
          break;
        
        case 'GROUP_CHANGED':
        case 'GROUP_ADDED':
        case 'GROUP_REMOVED':
          this.handleGroupEvent(event);
          break;
      }
    }

    // Generic event
    this.emit('system_event', event);
  }

  /**
   * Lädt den kompletten System State
   */
  private async loadSystemState(): Promise<void> {
    try {
      this.logger('⬅️ Lade System State...');
      
      const state = await this.sendSystemRequest('/hmip/home/getSystemState');
      
      this.systemState = state;
      
      // Devices cachen (devices ist ein Object, kein Array!)
      if (state.devices) {
        const deviceArray = Array.isArray(state.devices) 
          ? state.devices 
          : Object.values(state.devices);
        
        for (const device of deviceArray) {
          this.devices.set(device.id, device);
        }
        this.logger(`✅ ${this.devices.size} Geräte geladen`);
      }

      // Groups cachen (groups ist ein Object, kein Array!)
      if (state.groups) {
        const groupArray = Array.isArray(state.groups)
          ? state.groups
          : Object.values(state.groups);
        
        for (const group of groupArray) {
          this.groups.set(group.id, group);
        }
        this.logger(`✅ ${this.groups.size} Gruppen geladen`);
      }

      this.emit('system_state_loaded', this.systemState);
      
    } catch (error) {
      this.errorLogger('❌ Fehler beim Laden des System State:', error);
      throw error;
    }
  }

  /**
   * Verarbeitet Device Events und aktualisiert Cache
   */
  private handleDeviceEvent(event: any): void {
    if (event.device) {
      const deviceId = event.device.id;
      
      if (event.pushEventType === 'DEVICE_REMOVED') {
        this.devices.delete(deviceId);
      } else {
        this.devices.set(deviceId, event.device);
      }

      // Event an spezifisches Gerät senden
      this.emit(`device_update:${deviceId}`, event.device);
      this.emit('device_update', event.device);
    }
  }

  /**
   * Verarbeitet Group Events
   */
  private handleGroupEvent(event: any): void {
    if (event.group) {
      const groupId = event.group.id;
      
      if (event.pushEventType === 'GROUP_REMOVED') {
        this.groups.delete(groupId);
      } else {
        this.groups.set(groupId, event.group);
      }

      this.emit('group_update', event.group);
    }
  }

  /**
   * Ping-Intervall für Keep-Alive
   */
  private startPingInterval(): void {
    this.pingInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.ping();
      }
    }, 30000); // Alle 30 Sekunden
  }

  private stopPingInterval(): void {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = null;
    }
  }

  /**
   * Plant Neuverbindung nach Verbindungsabbruch
   */
  private scheduleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      this.errorLogger('❌ Maximale Anzahl an Verbindungsversuchen erreicht');
      this.emit('connection_failed');
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    this.logger(`🔄 Neuverbindung in ${delay}ms (Versuch ${this.reconnectAttempts})`);

    this.reconnectTimer = setTimeout(async () => {
      try {
        await this.connectWebSocket();
        await this.loadSystemState();
        this.startPingInterval();
      } catch (error) {
        this.errorLogger('❌ Neuverbindung fehlgeschlagen:', error);
      }
    }, delay);
  }

  // ========================================================================
  // PUBLIC API METHODS - Gemäß Connect API /hmip/device/control/
  // ========================================================================

  /**
   * Ruft alle Geräte aus dem Cache ab
   */
  getDevices(): any[] {
    return Array.from(this.devices.values());
  }

  /**
   * Ruft ein spezifisches Gerät aus dem Cache ab
   */
  getDevice(deviceId: string): any | undefined {
    return this.devices.get(deviceId);
  }

  /**
   * Ruft alle Gruppen ab
   */
  getGroups(): any[] {
    return Array.from(this.groups.values());
  }

  /**
   * Ruft Home-Informationen ab
   */
  getHome(): any {
    return this.systemState?.home || null;
  }

  /**
   * Setzt Switch State (Ein/Aus)
   * Path: /hmip/device/control/setSwitchState
   */
  async setSwitchState(deviceId: string, channelIndex: number, on: boolean): Promise<void> {
    await this.sendSystemRequest('/hmip/device/control/setSwitchState', {
      deviceId: deviceId,
      channelIndex: channelIndex,
      on: on
    });
  }

  /**
   * Setzt Dim Level (0.0 - 1.0)
   * Path: /hmip/device/control/setDimLevel
   */
  async setDimLevel(deviceId: string, channelIndex: number, dimLevel: number): Promise<void> {
    await this.sendSystemRequest('/hmip/device/control/setDimLevel', {
      deviceId: deviceId,
      channelIndex: channelIndex,
      dimLevel: dimLevel
    });
  }

  /**
   * Setzt Shutter Level (0.0 = geschlossen, 1.0 = offen)
   * Path: /hmip/device/control/setShutterLevel
   */
  async setShutterLevel(deviceId: string, channelIndex: number, shutterLevel: number): Promise<void> {
    await this.sendSystemRequest('/hmip/device/control/setShutterLevel', {
      deviceId: deviceId,
      channelIndex: channelIndex,
      shutterLevel: shutterLevel
    });
  }

  /**
   * Stoppt Shutter/Blind
   * Path: /hmip/device/control/setShutterStop
   */
  async setShutterStop(deviceId: string, channelIndex: number): Promise<void> {
    await this.sendSystemRequest('/hmip/device/control/setShutterStop', {
      deviceId: deviceId,
      channelIndex: channelIndex
    });
  }

  /**
   * Setzt Thermostat Temperatur
   * Path: /hmip/device/control/setSetPointTemperature
   */
  async setSetPointTemperature(deviceId: string, channelIndex: number, setPointTemperature: number): Promise<void> {
    await this.sendSystemRequest('/hmip/device/control/setSetPointTemperature', {
      deviceId: deviceId,
      channelIndex: channelIndex,
      setPointTemperature: setPointTemperature
    });
  }

  /**
   * Setzt Control Mode des Thermostats
   * Path: /hmip/device/control/setControlMode
   */
  async setControlMode(deviceId: string, channelIndex: number, controlMode: string): Promise<void> {
    await this.sendSystemRequest('/hmip/device/control/setControlMode', {
      deviceId: deviceId,
      channelIndex: channelIndex,
      controlMode: controlMode
    });
  }

  /**
   * Fordert aktuellen System State an (für Refresh)
   */
  async refreshSystemState(): Promise<any> {
    return await this.sendSystemRequest('/hmip/home/getSystemState');
  }

  /**
   * Trennt die Verbindung
   */
  async disconnect(): Promise<void> {
    this.stopPingInterval();
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    // Clear alle pending requests
    for (const [id, pending] of this.pendingRequests.entries()) {
      clearTimeout(pending.timeout);
      pending.reject(new Error('Connection closed'));
    }
    this.pendingRequests.clear();

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.logger('👋 Von Homematic IP Connect API getrennt');
  }
}

