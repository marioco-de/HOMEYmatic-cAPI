/**
 * API-Endpunkte für die Settings-Seite
 */
module.exports = {
  /**
   * Gibt alle Geräte zurück
   */
  async getDevices({ homey }: { homey: any }): Promise<any> {
    const app = homey.app as any;
    
    try {
      const api = app.getAPI();
      const devices = await api.getDevices();
      
      return {
        success: true,
        devices: devices,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Testet die API-Verbindung
   */
  async testConnection({ 
    homey, 
    body 
  }: { 
    homey: any; 
    body: { 
      hcuHost: string; 
      authToken: string; 
      pluginId?: string; 
    } 
  }): Promise<any> {
    try {
      const { HomematicConnectAPI } = require('./lib/HomematicConnectAPI');
      
      const pluginId = body.pluginId || 'de.homematic.homey.plugin';
      
      const testApi = new HomematicConnectAPI(
        body.hcuHost,
        body.authToken,
        pluginId,
        console.log,
        console.error
      );

      await testApi.connect();
      const home = testApi.getHome();
      const deviceCount = testApi.getDevices().length;
      await testApi.disconnect();

      return {
        success: true,
        connected: true,
        home: home,
        deviceCount: deviceCount,
      };
    } catch (error: any) {
      return {
        success: false,
        connected: false,
        error: error.message,
      };
    }
  },

  /**
   * Speichert die API-Konfiguration und stellt Verbindung her
   */
  async saveConfig({ 
    homey, 
    body 
  }: { 
    homey: any; 
    body: { 
      hcuHost: string; 
      authToken: string; 
      pluginId?: string; 
    } 
  }): Promise<any> {
    try {
      const app = homey.app as any;
      
      console.log('💾 Speichere Konfiguration und stelle Verbindung her...');
      
      await app.updateAPIConfig(
        body.hcuHost,
        body.authToken,
        body.pluginId
      );

      console.log('✅ Konfiguration gespeichert und Verbindung hergestellt');

      return {
        success: true,
        message: 'Konfiguration gespeichert und Verbindung hergestellt'
      };
    } catch (error: any) {
      console.error('❌ Fehler beim Speichern der Konfiguration:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  },

  /**
   * Gibt den aktuellen API-Status zurück
   */
  async getStatus({ homey }: { homey: any }): Promise<any> {
    try {
      const app = homey.app as any;
      
      // Prüfe ob API überhaupt existiert
      if (!app.api) {
        return {
          success: false,
          connected: false,
          error: 'API noch nicht konfiguriert. Bitte HCU Host und Auth Token in den Einstellungen eintragen.',
        };
      }
      
      const api = app.getAPI();
      const home = api.getHome();
      const devices = api.getDevices();

      // Wenn keine Geräte geladen sind, ist die Verbindung wahrscheinlich nicht aktiv
      if (!home && devices.length === 0) {
        return {
          success: false,
          connected: false,
          error: 'Keine Verbindung zur HCU. API versucht automatisch neu zu verbinden.',
        };
      }

      return {
        success: true,
        connected: true,
        deviceCount: devices.length,
        home: home,
      };
    } catch (error: any) {
      return {
        success: false,
        connected: false,
        error: error.message,
      };
    }
  },

  /**
   * Generiert einen neuen Auth Token über die HCU Connect API
   */
  async generateToken({
    homey,
    body
  }: {
    homey: any;
    body: {
      hcuHost: string;
      activationKey: string;
      pluginId?: string;
    }
  }): Promise<any> {
    const https = require('https');
    
    try {
      const { hcuHost, activationKey, pluginId = 'de.maricode.homeymatic.capi' } = body;

      if (!hcuHost || !activationKey) {
        return {
          success: false,
          error: 'HCU Host und Activation Key sind erforderlich'
        };
      }

      // HTTPS Agent der selbstsignierte Zertifikate akzeptiert
      const httpsAgent = new https.Agent({
        rejectUnauthorized: false
      });

      const axios = require('axios');

      // Schritt 1: Token anfordern
      console.log('🔑 Fordere Token an von:', hcuHost);
      
      const requestUrl = `https://${hcuHost}:6969/hmip/auth/requestConnectApiAuthToken`;
      const requestResponse = await axios.post(requestUrl, {
        activationKey: activationKey,
        pluginId: pluginId,
        friendlyName: {
          de: 'Homey Integration',
          en: 'Homey Integration'
        }
      }, {
        headers: {
          'Content-Type': 'application/json',
          'VERSION': '12'
        },
        httpsAgent: httpsAgent,
        timeout: 10000
      });

      const authToken = requestResponse.data.authToken;

      if (!authToken) {
        throw new Error('Kein Token in der Response erhalten');
      }

      console.log('✅ Token erhalten, bestätige...');

      // Schritt 2: Token bestätigen
      const confirmUrl = `https://${hcuHost}:6969/hmip/auth/confirmConnectApiAuthToken`;
      const confirmResponse = await axios.post(confirmUrl, {
        activationKey: activationKey,
        authToken: authToken
      }, {
        headers: {
          'Content-Type': 'application/json',
          'VERSION': '12'
        },
        httpsAgent: httpsAgent,
        timeout: 10000
      });

      console.log('✅ Token bestätigt!');

      return {
        success: true,
        authToken: authToken,
        clientId: confirmResponse.data.clientId
      };

    } catch (error: any) {
      console.error('❌ Fehler bei Token-Generierung:', error.message);
      
      let errorMessage = error.message;
      
      if (error.code === 'ECONNREFUSED') {
        errorMessage = 'HCU nicht erreichbar - Prüfen Sie Host/IP und Port';
      } else if (error.code === 'ETIMEDOUT') {
        errorMessage = 'Verbindung zur HCU timeout - HCU erreichbar?';
      } else if (error.response) {
        errorMessage = `HCU Fehler ${error.response.status}: ${error.response.data?.errorCode || 'Unbekannt'}`;
      }

      return {
        success: false,
        error: errorMessage
      };
    }
  },
};

