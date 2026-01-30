import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';

import { DataverseConfig } from './dataverse.config';

@Injectable()
export class DataverseAuthService {
  private readonly logger = new Logger(DataverseAuthService.name);
  private accessToken: string | null = null;
  private tokenExpiry: Date | null = null;

  constructor(private config: DataverseConfig) {}

  async getAccessToken(): Promise<string> {
    if (this.accessToken && this.tokenExpiry && new Date() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const tokenUrl = `https://login.microsoftonline.com/${this.config.tenantId}/oauth2/token`;

      this.logger.debug('=== TOKEN REQUEST DEBUG ===');
      this.logger.debug(`Token URL: ${tokenUrl}`);
      this.logger.debug(`Client ID: ${this.config.clientId}`);
      this.logger.debug(`Tenant ID: ${this.config.tenantId}`);
      this.logger.debug(`Resource: ${this.config.url}`);

      const params = new URLSearchParams();
      params.append('grant_type', 'client_credentials');
      params.append('client_id', this.config.clientId);
      params.append('client_secret', this.config.clientSecret);
      params.append('resource', this.config.url);

      this.logger.debug(`Request params: ${params.toString()}`);

      const response = await axios.post(tokenUrl, params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      this.accessToken = response.data.access_token;
      const expiresIn = response.data.expires_in || 3600;
      this.tokenExpiry = new Date(Date.now() + (expiresIn - 60) * 1000); // Refresh 1 minute early

      this.logger.log('Successfully obtained access token');
      return this.accessToken;
    } catch (error) {
      console.error('=== TOKEN ERROR DETAILS ===');
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);
      console.error('Error headers:', error.response?.headers);

      this.logger.error('Failed to obtain access token:', error.response?.data || error.message);
      throw error;
    }
  }
}
