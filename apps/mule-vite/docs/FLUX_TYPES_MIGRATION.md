# Flux Types Migration

## Overview

This document tracks the migration of mule-vite to use the centralized API types from `@asyml8/api-types` package, specifically the flux API types.

## Completed Migrations

### Public Startup Service (2025-12-14)

Migrated the public startup registration flow to use flux types from `@asyml8/api-types/src/generated/flux`.

#### Files Modified

1. **src/services/account-public.service.ts**
   - Replaced local `AccessRequest` type with `RegisterOrganizationContactDto`
   - Replaced local `NewOrganizationRequest` type with `RegisterOrganizationDto`
   - Updated return types to use `RegisterResponseDto`
   - Import: `import type { RegisterOrganizationContactDto, RegisterOrganizationDto, RegisterResponseDto } from '@asyml8/api-types/src/generated/flux'`

2. **src/sections/register/register-organization-contact-view.tsx**
   - Updated `createAccessRequest` call to use new field names:
     - `firstName`, `lastName`, `email`, `phone`, `businessPhone`, `organizationId`
   - Removed old OData binding format

3. **src/sections/register/register-organization-view.tsx**
   - Updated `createNewOrganization` call to use new field names:
     - `organizationName`, `organizationType`, `orgCode`, `govCode`, etc.
   - Added `organizationType` enum mapping (State=448150000, County=448150001, Local=448150002, Tribal=448150003)
   - Added required `acceptedTerms` field

4. **src/services/account.service.ts**
   - Removed duplicate public methods (`listAccountsForSelect`, `createAccessRequest`, `createNewOrganization`)
   - These methods now only exist in `account-public.service.ts`

5. **src/services/account.types.ts**
   - Removed deprecated `AccessRequest` and `NewOrganizationRequest` interfaces
   - Added comment noting migration to flux types
   - Kept `Account` interface for authenticated account management

## Type Mappings

### RegisterOrganizationContactDto (Access Request)

| Old Field Name | New Field Name | Type | Required |
|----------------|----------------|------|----------|
| prvc_firstname | firstName | string | Yes |
| prvc_lastname | lastName | string | Yes |
| prvc_email | email | string | Yes |
| prvc_phonenumber | phone | string | Yes |
| prvc_businessphone | businessPhone | string | Yes |
| _prvc_organizationname_value@odata.bind | organizationId | string (GUID) | Yes |

### RegisterOrganizationDto (New Organization)

| Old Field Name | New Field Name | Type | Required |
|----------------|----------------|------|----------|
| prvc_entityname | organizationName | string | Yes |
| prvc_type | organizationType | enum (448150000-448150003) | Yes |
| prvc_acronym | acronym | string | No |
| prvc_organizationcode | orgCode | string | No |
| prvc_governmentcode | govCode | string | No |
| prvc_county | county | string | No |
| prvc_parentorganization | parentOrganization | string | No |
| prvc_organizationphone | organizationPhone | string | No |
| prvc_website | website | string | No |
| prvc_fax | fax | string | No |
| prvc_addressline1 | addressLine1 | string | No |
| prvc_addressline2 | addressLine2 | string | No |
| prvc_city | city | string | No |
| prvc_state | state | string | No |
| prvc_zipcode | zipCode | string | No |
| prvc_mailingaddressline | mailingAddressLine1 | string | No |
| prvc_mailingaddressline2 | mailingAddressLine2 | string | No |
| prvc_mailingcity | mailingCity | string | No |
| prvc_mailingaddressstate | mailingState | string | No |
| prvc_mailingaddresszipcode | mailingZipCode | string | No |
| prvc_mailingaddresscounty | mailingCounty | string | No |
| prvc_firstname | firstName | string | Yes |
| prvc_lastname | lastName | string | Yes |
| prvc_email | email | string | Yes |
| prvc_phonenumber | phone | string | Yes |
| prvc_businessphone | businessPhone | string | Yes |
| N/A | acceptedTerms | boolean | Yes |
| N/A | acceptedPrivacyPolicy | boolean | No |
| N/A | documentFileNames | string[] | No |

## Organization Type Enum

```typescript
export enum RegisterOrganizationDtoOrganizationTypeEnum {
  Value448150000 = 448150000, // State
  Value448150001 = 448150001, // County
  Value448150002 = 448150002, // Local
  Value448150003 = 448150003, // Tribal
}
```

## Benefits

1. **Type Safety**: Centralized types ensure consistency between frontend and backend
2. **Auto-generation**: Types are generated from Swagger/OpenAPI specs
3. **Single Source of Truth**: API contract changes are reflected immediately
4. **Better Documentation**: Types include JSDoc comments from API specs
5. **Reduced Duplication**: No need to maintain separate type definitions

## Next Steps

Consider migrating other services to use centralized types:
- Contact service
- Submission service
- User service
- Document types service

## Notes

- The flux types are generated from the flux API Swagger documentation
- Types are located in `packages/api-types/src/generated/flux/data-contracts.ts`
- Import path: `@asyml8/api-types/src/generated/flux`
- The API types package should be kept in sync with backend API changes
