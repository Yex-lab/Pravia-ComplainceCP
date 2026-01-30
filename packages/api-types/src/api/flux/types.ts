/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface EntityResponse {
  /** @example 200 */
  statusCode: number;
  /** @example "OK" */
  statusMessage: string;
  /** @example "The request succeeded" */
  statusDescription?: string;
  body: object | null;
  message: string | null;
}

export interface ContactResponseDto {
  /** Contact ID */
  id: string;
  /** Full name */
  fullName?: string;
  /** First name */
  firstName?: string;
  /** Last name */
  lastName?: string;
  /** Email address */
  email?: string;
  /** Phone number */
  phone?: string;
  /** Business phone extension */
  businessPhoneExtension?: string;
  /** Mobile phone */
  mobilePhone?: string;
  /** Job title */
  jobTitle?: string;
  /** Organization ID */
  organizationId?: string;
  /** Organization details */
  organization?: object;
  /**
   * Created date
   * @format date-time
   */
  createdOn?: string;
  /**
   * Modified date
   * @format date-time
   */
  modifiedOn?: string;
}

export interface CreateContactDto {
  /** First name of the contact */
  firstName: string;
  /** Last name of the contact */
  lastName: string;
  /** Email address of the contact */
  email?: string;
  /** Phone number of the contact */
  phone: string;
  /** Business phone extension */
  businessPhoneExtension?: string;
  /** Mobile phone */
  mobilePhone?: string;
  /** Job title of the contact */
  jobTitle: string;
  /** Organization ID */
  organizationId?: string;
}

export interface OrganizationContactRoleDto {
  /** Unique identifier */
  id: string;
  /** Organization ID */
  organizationId: string;
  /** Contact ID */
  contactId: string;
  /** Role ID */
  roleId: string;
  /**
   * Creation timestamp
   * @format date-time
   */
  createdAt: string;
  /**
   * Last update timestamp
   * @format date-time
   */
  updatedAt: string;
}

export interface OrganizationContactDocumentDto {
  /** Unique identifier */
  id: string;
  /** Organization ID */
  organizationId: string;
  /** Contact ID */
  contactId: string;
  /** Document Type ID */
  documentTypeId: string;
  /**
   * Creation timestamp
   * @format date-time
   */
  createdAt: string;
  /**
   * Last update timestamp
   * @format date-time
   */
  updatedAt: string;
}

export interface ContactWithPermissionsResponseDto {
  /** Contact ID */
  id: string;
  /** Full name */
  fullName?: string;
  /** First name */
  firstName?: string;
  /** Last name */
  lastName?: string;
  /** Email address */
  email?: string;
  /** Phone number */
  phone?: string;
  /** Business phone extension */
  businessPhoneExtension?: string;
  /** Mobile phone */
  mobilePhone?: string;
  /** Job title */
  jobTitle?: string;
  /** Organization ID */
  organizationId?: string;
  /** Organization details */
  organization?: object;
  /**
   * Created date
   * @format date-time
   */
  createdOn?: string;
  /**
   * Modified date
   * @format date-time
   */
  modifiedOn?: string;
  /** Organization roles assigned to the contact */
  organizationRoles?: OrganizationContactRoleDto[];
  /** Organization document types assigned to the contact */
  organizationDocuments?: OrganizationContactDocumentDto[];
}

export interface CreateContactWithPermissionsDto {
  /** First name of the contact */
  firstName: string;
  /** Last name of the contact */
  lastName: string;
  /** Email address of the contact */
  email?: string;
  /** Phone number of the contact */
  phone: string;
  /** Business phone extension */
  businessPhoneExtension?: string;
  /** Mobile phone */
  mobilePhone?: string;
  /** Job title of the contact */
  jobTitle: string;
  /** Organization ID */
  organizationId?: string;
  /** Array of role IDs to assign to the contact */
  roleIds?: string[];
  /** Array of document type IDs to assign to the contact */
  documentTypeIds?: string[];
}

export interface InviteContactDto {
  /**
   * Full name of the contact (will be split into first and last name)
   * @example "John Smith"
   */
  fullName: string;
  /**
   * Email address of the contact - must be unique
   * @example "john.smith@example.com"
   */
  email: string;
  /**
   * Organization ID (account ID) to link the contact to
   * @example "7b0b5495-605f-f011-bec3-0022480b413d"
   */
  organizationId: string;
}

export interface EntityListResponse {
  /** @example 200 */
  statusCode: number;
  /** @example "OK" */
  statusMessage: string;
  /** @example "The request succeeded" */
  statusDescription?: string;
  body: object[] | null;
  message: string | null;
}

export interface UpdateContactWithPermissionsDto {
  /** First name of the contact */
  firstName?: string;
  /** Last name of the contact */
  lastName?: string;
  /** Email address of the contact */
  email?: string;
  /** Phone number of the contact */
  phone?: string;
  /** Business phone extension */
  businessPhoneExtension?: string;
  /** Mobile phone */
  mobilePhone?: string;
  /** Job title of the contact */
  jobTitle?: string;
  /** Organization ID */
  organizationId?: string;
  /** Array of role IDs to assign to the contact (null to leave unchanged, empty array to remove all) */
  roleIds?: string[] | null;
  /** Array of document type IDs to assign to the contact (null to leave unchanged, empty array to remove all) */
  documentTypeIds?: string[] | null;
}

export interface SubmissionDto {
  /** Submission ID */
  id: string;
  /** Submission name */
  name?: string;
  /** State code */
  stateCode?: number;
  /** Status code */
  statusCode?: number;
  /** Account ID */
  accountId?: string;
  /** Primary contact ID */
  primaryContactId?: string;
  /** Document type ID */
  documentTypeId?: string;
  /** Primary contact details */
  primaryContact?: object;
  /** Document type details */
  documentType?: object;
  /**
   * Created date
   * @format date-time
   */
  createdOn?: string;
  /**
   * Modified date
   * @format date-time
   */
  modifiedOn?: string;
}

export interface SubmissionStatusResponseDto {
  /**
   * Submission ID
   * @example "97d5d1b0-05e5-f011-8544-6045bd0859f5"
   */
  submissionId: string;
  /**
   * Submission name
   * @example "Compliance Document Submission"
   */
  name?: string;
  /**
   * Document extraction status
   * @example "Extraction completed"
   */
  documentStatus?: SubmissionStatusResponseDtoDocumentStatusEnum;
  /**
   * Last modified date
   * @example "2025-10-17T18:17:40.000Z"
   */
  modifiedon?: string;
}

export interface CreateSubmissionDto {
  /** Submission name */
  name?: string;
  /** Account ID */
  accountId?: string;
  /** Primary contact ID */
  primaryContactId?: string;
  /** Document type ID */
  documentTypeId?: string;
}

export interface UpdateSubmissionDto {
  /** Submission name */
  name?: string;
  /** Account ID */
  accountId?: string;
  /** Primary contact ID */
  primaryContactId?: string;
  /** Document type ID */
  documentTypeId?: string;
}

export type Object = object;

export interface DocumentDataDto {
  /**
   * Base64 encoded document content
   * @example "JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoK..."
   */
  base64: string;
  /**
   * Original filename of the document
   * @example "submission-document.pdf"
   */
  filename: string;
  /**
   * MIME type of the document
   * @example "application/pdf"
   */
  mimetype: DocumentDataDtoMimetypeEnum;
}

export interface DocumentUrlDto {
  /**
   * Document URL (null when returning base64 data)
   * @example null
   */
  documentUrl: string | null;
  /**
   * Document data with base64 content and metadata
   * @example {"base64":"JVBERi0xLjQKJeLjz9MKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoK...","filename":"submission-document.pdf","mimetype":"application/pdf"}
   */
  documentData?: DocumentDataDto;
}

export interface DesigneeDto {
  /** Designee ID */
  id: string;
  /** Designee name */
  name: string;
  /** Organization ID */
  organizationId?: string;
  /** Document type ID */
  documentTypeId?: string;
  /** Document type name */
  documentTypeName?: string;
  /** Contact ID */
  contactId?: string;
  /**
   * Created date
   * @format date-time
   */
  createdOn: string;
  /**
   * Modified date
   * @format date-time
   */
  modifiedOn: string;
}

export interface DocumentTypeDto {
  /** Document type ID */
  id: string;
  /** Document type name */
  name?: string;
  /** State code */
  stateCode?: number;
  /** Status code */
  statusCode?: number;
  /**
   * Created date
   * @format date-time
   */
  createdOn?: string;
  /**
   * Modified date
   * @format date-time
   */
  modifiedOn?: string;
}

export interface CreateDocumentTypeDto {
  /** Document type name */
  name: string;
}

export interface UpdateDocumentTypeDto {
  /** Document type name */
  name?: string;
}

export interface CreateAttachmentDto {
  /** Subject/title */
  subject?: string;
  /** File name */
  filename: string;
  /** MIME type */
  mimetype: string;
  /** Base64 encoded file content */
  documentbody: string;
  /**
   * Related submission OData bind
   * @example "/prvc_submissions(guid)"
   */
  'objectid_prvc_submission@odata.bind'?: string;
  /** Related record type */
  objecttypecode?: string;
  /** Note text */
  notetext?: string;
  /** Is document flag */
  isdocument?: boolean;
}

export interface AccountDto {
  /**
   * Account ID
   * @example "f63a6f9c-605f-f011-bec3-0022480b413d"
   */
  id: string;
  /**
   * Organization name
   * @example "California Secretary of State"
   */
  name: string;
  /**
   * Organization acronym
   * @example "SOS"
   */
  acronym?: string;
  /**
   * Organization code (UID1)
   * @example "0890"
   */
  orgCode?: string;
  /**
   * Government code (UID2)
   * @example "11000"
   */
  govCode?: string;
  /** Primary contact ID */
  primaryContactId?: string;
  /** Parent account ID */
  parentAccountId?: string;
  /** Parent organization details */
  parentOrganization?: object;
  /** Compliance due date */
  complianceDueDate?: string;
  /** SOC email address */
  socEmailAddress?: string;
  /**
   * Organization category code (1=State, 2=County, 895080001=Local, 895080002=Tribal)
   * @example 1
   */
  categoryCode?: number;
  /**
   * Organization category label
   * @example "State"
   */
  category?: string;
  /** Primary address line 1 */
  addressLine1?: string;
  /** Primary address line 2 */
  addressLine2?: string;
  /** Primary address city */
  city?: string;
  /** Primary address postal code */
  postalCode?: string;
  /** Primary address state */
  state?: string;
  /** Primary address county */
  county?: string;
  /** Mailing address line 1 */
  mailingAddressLine1?: string;
  /** Mailing address line 2 */
  mailingAddressLine2?: string;
  /** Mailing address city */
  mailingCity?: string;
  /** Mailing address postal code */
  mailingPostalCode?: string;
  /** Mailing address state */
  mailingState?: string;
  /** Mailing address county */
  mailingCounty?: string;
  /** Email address */
  email?: string;
  /** Phone number */
  phone?: string;
  /** Fax number */
  fax?: string;
  /** Website URL */
  website?: string;
  /**
   * Created date
   * @format date-time
   */
  createdOn?: string;
  /**
   * Modified date
   * @format date-time
   */
  modifiedOn?: string;
}

export interface SetPrimaryContactDto {
  /** Contact ID to set as primary contact. Null removes primary contact. */
  primaryContactId?: string | null;
}

export interface CreateAccountDto {
  /** Organization name */
  name?: string;
  /** Organization acronym */
  acronym?: string;
  /** Organization code (UID1) */
  orgCode?: string;
  /** Government code (UID2) */
  govCode?: string;
  /** Primary contact ID */
  primaryContactId?: string;
  /** Parent account ID */
  parentAccountId?: string;
  /** Compliance due date */
  complianceDueDate?: string;
  /** SOC email address */
  socEmailAddress?: string;
  /** Organization category code */
  categoryCode?: number;
  /** Organization type */
  organizationType?: number;
  /** Primary address line 1 */
  addressLine1?: string;
  /** Primary address line 2 */
  addressLine2?: string;
  /** Primary address city */
  city?: string;
  /** Primary address postal code */
  postalCode?: string;
  /** Primary address state */
  state?: string;
  /** Primary address county */
  county?: string;
  /** Mailing address line 1 */
  mailingAddressLine1?: string;
  /** Mailing address line 2 */
  mailingAddressLine2?: string;
  /** Mailing address city */
  mailingCity?: string;
  /** Mailing address postal code */
  mailingPostalCode?: string;
  /** Mailing address state */
  mailingState?: string;
  /** Mailing address county */
  mailingCounty?: string;
  /** Email address */
  email?: string;
  /** Phone number */
  phone?: string;
  /** Fax number */
  fax?: string;
  /** Website URL */
  website?: string;
}

export interface UpdateAccountDto {
  /** Organization name */
  name?: string;
  /** Organization acronym */
  acronym?: string;
  /** Organization code (UID1) */
  orgCode?: string;
  /** Government code (UID2) */
  govCode?: string;
  /** Primary contact ID */
  primaryContactId?: string;
  /** Parent account ID */
  parentAccountId?: string;
  /** Compliance due date */
  complianceDueDate?: string;
  /** SOC email address */
  socEmailAddress?: string;
  /** Organization category code */
  categoryCode?: number;
  /** Organization type */
  organizationType?: number;
  /** Primary address line 1 */
  addressLine1?: string;
  /** Primary address line 2 */
  addressLine2?: string;
  /** Primary address city */
  city?: string;
  /** Primary address postal code */
  postalCode?: string;
  /** Primary address state */
  state?: string;
  /** Primary address county */
  county?: string;
  /** Mailing address line 1 */
  mailingAddressLine1?: string;
  /** Mailing address line 2 */
  mailingAddressLine2?: string;
  /** Mailing address city */
  mailingCity?: string;
  /** Mailing address postal code */
  mailingPostalCode?: string;
  /** Mailing address state */
  mailingState?: string;
  /** Mailing address county */
  mailingCounty?: string;
  /** Email address */
  email?: string;
  /** Phone number */
  phone?: string;
  /** Fax number */
  fax?: string;
  /** Website URL */
  website?: string;
}

export interface RegisterResponseDto {
  /**
   * Registration request ID
   * @example "1a435231-84ab-f011-aa43-000d3a3b0972"
   */
  id: string;
  /**
   * First name
   * @example "John"
   */
  firstName: string;
  /**
   * Last name
   * @example "Doe"
   */
  lastName: string;
  /**
   * Email address
   * @example "john.doe@example.com"
   */
  email: string;
  /**
   * Request status
   * @example "Pending"
   */
  status: RegisterResponseDtoStatusEnum;
}

export interface RegisterOrganizationDto {
  /**
   * Organization type
   * @example 448150000
   */
  organizationType: RegisterOrganizationDtoOrganizationTypeEnum;
  /**
   * First name
   * @example "Jane"
   */
  firstName: string;
  /**
   * Last name
   * @example "Smith"
   */
  lastName: string;
  /**
   * Email address
   * @example "jane.smith@neworg.com"
   */
  email: string;
  /**
   * Phone number
   * @example "(555) 987-6543"
   */
  phone: string;
  /**
   * Business phone with optional extension
   * @example "(555) 987-6543 ext 456"
   */
  businessPhone: string;
  /**
   * Organization name
   * @example "Acme Corporation"
   */
  organizationName: string;
  /**
   * Organization acronym (required for State entities)
   * @example "ACME"
   */
  acronym?: string;
  /**
   * Organization code / UID1 (required for State entities)
   * @example "ORG001"
   */
  orgCode?: string;
  /**
   * Government code / UID2 (required for State entities)
   * @example "GOV001"
   */
  govCode?: string;
  /**
   * Parent organization ID (required for State entities)
   * @example "213b6f9c-605f-f011-bec3-0022480b413d"
   */
  parentOrganizationId?: string;
  /**
   * County
   * @example "Los Angeles"
   */
  county?: string;
  /**
   * Organization main phone
   * @example "(555) 100-2000"
   */
  organizationPhone?: string;
  /**
   * Organization website
   * @example "https://www.acmecorp.com"
   */
  website?: string;
  /**
   * Fax number
   * @example "(555) 100-2001"
   */
  fax?: string;
  /**
   * Physical address line 1
   * @example "123 Main Street"
   */
  addressLine1?: string;
  /**
   * Physical address line 2
   * @example "Suite 100"
   */
  addressLine2?: string;
  /**
   * City
   * @example "Los Angeles"
   */
  city?: string;
  /**
   * State (2-letter code)
   * @example "CA"
   */
  state?: string;
  /**
   * Zip code
   * @example "90001"
   */
  zipCode?: string;
  /**
   * Mailing address line 1
   * @example "PO Box 12345"
   */
  mailingAddressLine1?: string;
  /** Mailing address line 2 */
  mailingAddressLine2?: string;
  /**
   * Mailing city
   * @example "Los Angeles"
   */
  mailingCity?: string;
  /**
   * Mailing state (2-letter code)
   * @example "CA"
   */
  mailingState?: string;
  /**
   * Mailing zip code
   * @example "90002"
   */
  mailingZipCode?: string;
  /**
   * Mailing county
   * @example "Los Angeles"
   */
  mailingCounty?: string;
  /** Document file names (if uploaded) */
  documentFileNames?: string[];
  /**
   * User accepted terms of service
   * @example true
   */
  acceptedTerms: boolean;
  /**
   * User accepted privacy policy (if configured)
   * @example true
   */
  acceptedPrivacyPolicy?: boolean;
}

export interface AccessRequestDto {
  /**
   * Organization ID
   * @example "1a435231-84ab-f011-aa43-000d3a3b0972"
   */
  id: string;
  /**
   * Organization code / UID1
   * @example "ORG001"
   */
  orgCode?: string;
  /**
   * Government code / UID2
   * @example "GOV001"
   */
  govCode?: string;
  /**
   * First name
   * @example "Jane"
   */
  firstName: string;
  /**
   * Last name
   * @example "Smith"
   */
  lastName: string;
  /**
   * Email address
   * @example "jane.smith@example.com"
   */
  email: string;
  /**
   * Phone number
   * @example "(555) 987-6543"
   */
  phone: string;
  /**
   * Business phone with optional extension
   * @example "(555) 987-6543 ext 456"
   */
  businessPhone: string;
  /**
   * User accepted terms of service
   * @example true
   */
  acceptedTerms: boolean;
  /**
   * User accepted privacy policy (if configured)
   * @example true
   */
  acceptedPrivacyPolicy?: boolean;
}

export interface CleanupRegisterRecordsDto {
  /**
   * Timeframe in minutes (default: 60)
   * @default 60
   * @example 60
   */
  minutes?: number;
  /**
   * Delete all statuses (default: false, only pending)
   * @default false
   * @example false
   */
  deleteAll?: boolean;
}

export interface CleanupOrganizationDto {
  /**
   * Organization ID
   * @example "c3ccf32b-615f-f011-bec3-0022480b413d"
   */
  organizationId: string;
}

export interface CleanupOrganizationCompleteDto {
  /**
   * Timeframe in minutes (default: 60)
   * @default 60
   * @example 60
   */
  minutes?: number;
  /**
   * Organization ID to cleanup. When null or omitted, deletes ALL organizations within timeframe.
   * @example "c3ccf32b-615f-f011-bec3-0022480b413d"
   */
  organizationId?: string;
  /**
   * Include all register record statuses (default: true). When false, only deletes pending (448150002) records. When true, deletes all statuses (pending, approved, rejected).
   * @default true
   * @example true
   */
  includeAllStatuses?: boolean;
}

export interface CreateOrganizationContactRoleDto {
  /** Organization ID */
  organizationId: string;
  /** Contact ID */
  contactId: string;
  /** Role ID */
  roleId: string;
}

export interface CreateOrganizationContactDocumentDto {
  /** Organization ID */
  organizationId: string;
  /** Contact ID */
  contactId: string;
  /** Document Type ID */
  documentTypeId: string;
}

/**
 * Document extraction status
 * @example "Extraction completed"
 */
export enum SubmissionStatusResponseDtoDocumentStatusEnum {
  ExtractionProcessInitiated = 'Extraction process initiated',
  ValidatingDocumentOrganization = 'Validating document organization',
  ExtractingTheDocument = 'Extracting the document',
  AnalyzingTheDocument = 'Analyzing the document',
  SavingInformation = 'Saving information',
  ExtractionCompleted = 'Extraction completed',
  Error = 'Error',
}

/**
 * MIME type of the document
 * @example "application/pdf"
 */
export enum DocumentDataDtoMimetypeEnum {
  ApplicationPdf = 'application/pdf',
  ImagePng = 'image/png',
  ImageJpeg = 'image/jpeg',
  ApplicationMsword = 'application/msword',
  ApplicationVndOpenxmlformatsOfficedocumentWordprocessingmlDocument = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
}

/**
 * Request status
 * @example "Pending"
 */
export enum RegisterResponseDtoStatusEnum {
  Pending = 'Pending',
  Approved = 'Approved',
  Denied = 'Denied',
}

/**
 * Organization type
 * @example 448150000
 */
export enum RegisterOrganizationDtoOrganizationTypeEnum {
  Value448150000 = 448150000,
  Value448150001 = 448150001,
  Value448150002 = 448150002,
  Value448150003 = 448150003,
}
