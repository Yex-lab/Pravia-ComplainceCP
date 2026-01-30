import { ConfidentialClientApplication } from '@azure/msal-node';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DynamicsWebApi } from 'dynamics-web-api';

@Injectable()
export class DynamicsConfigService {
  private readonly logger = new Logger(DynamicsConfigService.name);
  private dynamicsWebApi: DynamicsWebApi;

  constructor(private readonly configService: ConfigService) {
    this.initializeDynamicsWebApi();
  }

  private initializeDynamicsWebApi(): void {
    const serverUrl = this.configService.get<string>('DATAVERSE_URL');
    const clientId = this.configService.get<string>('DATAVERSE_CLIENT_ID');
    const clientSecret = this.configService.get<string>('DATAVERSE_CLIENT_SECRET');
    const tenantId = this.configService.get<string>('DATAVERSE_TENANT_ID');

    // this.logger.log('=== DATAVERSE CONFIG DEBUG ===');
    // this.logger.log('DATAVERSE_URL:', serverUrl);
    // this.logger.log('DATAVERSE_CLIENT_ID:', clientId);
    // this.logger.log('DATAVERSE_CLIENT_SECRET length:', clientSecret?.length);
    // this.logger.log('DATAVERSE_TENANT_ID:', tenantId);

    if (!serverUrl || !clientId || !clientSecret || !tenantId) {
      this.logger.error('Missing Dataverse configuration - initialization skipped');
      return;
    }

    const config = {
      serverUrl: serverUrl,
      version: '9.2',
      useEntityNames: true,
      maxPageSize: 5000,
      returnRepresentation: true,
      timeout: 30000,
      onTokenRefresh: async () => {
        try {
          // Use proper MSAL import and configuration
          const clientConfig = {
            auth: {
              clientId: clientId,
              clientSecret: clientSecret,
              authority: `https://login.microsoftonline.com/${tenantId}`,
            },
          };
          const cca = new ConfidentialClientApplication(clientConfig);
          const clientCredentialRequest = {
            scopes: [`${serverUrl}/.default`],
          };

          const response = await cca.acquireTokenByClientCredential(clientCredentialRequest);

          this.logger.log('Token refreshed successfully');
          return response?.accessToken;
        } catch (error) {
          console.error('=== MSAL ERROR DETAILS ===');
          console.error('Error:', error);
          console.error('Error message:', error.message);
          console.error('Error code:', error.errorCode);
          console.error('Error description:', error.errorMessage);

          this.logger.error('Failed to refresh token:', error);
          throw error;
        }
      },
    };

    this.dynamicsWebApi = new DynamicsWebApi(config);
    this.logger.log('DynamicsWebApi initialized successfully');
  }

  getDynamicsWebApi(): DynamicsWebApi {
    return this.dynamicsWebApi;
  }

  async testConnection(): Promise<boolean> {
    // TODO: Temporarily disabled for deployment testing
    this.logger.warn('Dynamics connection test disabled');
    return false;
  }
}
