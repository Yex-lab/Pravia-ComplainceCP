import type { createHttpHelpers } from '../../../core/http-helpers';
import type {
  AccountDto,
  RegisterResponseDto,
  RegisterOrganizationDto,
  AccessRequestDto,
} from '../types';

export const createPublicService = (
  http: ReturnType<typeof createHttpHelpers>,
  basePath: string,
) => {
  return {
    getPublicAccounts: (): Promise<AccountDto[]> => http.get(`${basePath}/api/public/accounts`),

    getPublicAccountsSimilar: (): Promise<AccountDto[]> =>
      http.get(`${basePath}/api/public/accounts/similar`),

    createPublicAccountsRegisterCreate: (
      data: RegisterOrganizationDto,
    ): Promise<RegisterResponseDto> =>
      http.post(`${basePath}/api/public/accounts/register/create`, data),

    createPublicAccountsRegisterRequestAccess: (
      data: AccessRequestDto,
    ): Promise<RegisterResponseDto> =>
      http.post(`${basePath}/api/public/accounts/register/request-access`, data),

    createPublicAccountsOrganization: (
      data: RegisterOrganizationDto,
    ): Promise<RegisterResponseDto> =>
      http.post(`${basePath}/api/public/accounts/organization`, data),

    createPublicAccountsRegisterSupportingFiles: (data: any): Promise<any> =>
      http.post(`${basePath}/api/public/accounts/register/supporting-files`, data),

    createPublicAccountsByIdTestUpload: (id: string, data: any): Promise<any> =>
      http.post(`${basePath}/api/public/accounts/${id}/test-upload`, data),
  };
};
