export interface ContactStatusDto {
  email: string;
  status: 'not_registered' | 'pending' | 'confirmed';
  emailConfirmedAt?: string;
  createdAt?: string;
}

export interface BulkContactStatusDto {
  emails: string[];
}

export interface BulkContactStatusResponseDto {
  contacts: ContactStatusDto[];
}

export const contactsService = {
  async getContactStatus(email: string): Promise<ContactStatusDto> {
    try {
      const baseUrl = import.meta.env.VITE_AUTH_API_URL;
      const url = `${baseUrl}/api/contacts/status?email=${encodeURIComponent(email)}`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const rawData = await response.json();
      const data = rawData.body || rawData;

      return data;
    } catch (error) {
      return {
        email,
        status: 'not_registered',
      };
    }
  },

  async getBulkContactStatus(emails: string[]): Promise<BulkContactStatusResponseDto> {
    try {
      const promises = emails.map((email) => this.getContactStatus(email));
      const results = await Promise.allSettled(promises);

      const contacts = results.map((result, index) => {
        if (result.status === 'fulfilled') {
          return result.value;
        } else {
          return {
            email: emails[index],
            status: 'not_registered' as const,
          };
        }
      });

      return { contacts };
    } catch (error) {
      return {
        contacts: emails.map((email) => ({
          email,
          status: 'not_registered' as const,
        })),
      };
    }
  },
};
