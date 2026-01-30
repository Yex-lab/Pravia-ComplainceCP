import type { createHttpHelpers } from '../../../core/http-helpers';
import type {
  AccountDto,
  SetPrimaryContactDto,
  CreateAccountDto,
  UpdateAccountDto,
} from '../types';

export const createAccountsService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getAccountsBackendTestCompleteById: (id: string): Promise<any> =>
      http.get(`${basePath}/api/accounts/backend/test-complete/${id}`),

    getAccountsBackend: (): Promise<AccountDto[]> => http.get(`${basePath}/api/accounts/backend`),

    createAccountsBackend: (data: CreateAccountDto): Promise<object> =>
      http.post(`${basePath}/api/accounts/backend`, data),

    getAccountsBackendCompleteById: (id: string): Promise<object> =>
      http.get(`${basePath}/api/accounts/backend/complete/${id}`),

    getAccounts: (): Promise<AccountDto[]> => http.get(`${basePath}/api/accounts`),

    createAccounts: (data: CreateAccountDto): Promise<object> =>
      http.post(`${basePath}/api/accounts`, data),

    getAccountsWithContacts: (): Promise<AccountDto[]> =>
      http.get(`${basePath}/api/accounts/with-contacts`),

    getAccountsByIdWithContacts: (id: string): Promise<AccountDto> =>
      http.get(`${basePath}/api/accounts/${id}/with-contacts`),

    getAccountsById: (id: string): Promise<AccountDto> =>
      http.get(`${basePath}/api/accounts/${id}`),

    updateAccountsById: (id: string, data: UpdateAccountDto): Promise<object> =>
      http.put(`${basePath}/api/accounts/${id}`, data),

    updateAccountsByIdPrimaryContact: (
      id: string,
      data: SetPrimaryContactDto,
    ): Promise<AccountDto> => http.put(`${basePath}/api/accounts/${id}/primary-contact`, data),

    updateAccountsBackendById: (id: string, data: UpdateAccountDto): Promise<object> =>
      http.put(`${basePath}/api/accounts/backend/${id}`, data),

    deleteAccountsBackendById: (id: string): Promise<void> =>
      http.delete(`${basePath}/api/accounts/backend/${id}`),
  };
};
