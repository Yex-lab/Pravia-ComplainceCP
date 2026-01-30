// Compliance entity types

/**
 * Main compliance submission entity - represents a compliance submission from Power Pages
 * Used for tracking compliance documents, status, and due dates
 */
export interface Submission {
  /** Unique identifier for the submission */
  prvc_submissionid?: string;
  /** Display name/title of the submission */
  prvc_name: string;
  /** Detailed description of what needs to be submitted */
  prvc_description?: string;
  /** Current status of the submission (option set value) */
  prvc_status?: number;
  /** Date when submission was made */
  prvc_submissiondate?: Date;
  /** Due date for the submission */
  prvc_duedate?: Date;
  /** Reference to document type required */
  prvc_documenttype?: string;
  /** System created date */
  createdon?: Date;
  /** System modified date */
  modifiedon?: Date;
  /** Record status code (Active/Inactive) */
  statuscode?: number;
  /** Record state code */
  statecode?: number;
}

/**
 * Document type lookup entity - defines types of documents that can be submitted
 * Used as reference data for submissions
 */
export interface DocumentType {
  /** Unique identifier for the document type */
  prvc_documenttypeid?: string;
  /** Name of the document type (e.g., "Tax Return", "Financial Statement") */
  prvc_name: string;
  /** Description of what this document type contains */
  prvc_description?: string;
  /** Whether this document type is required for compliance */
  prvc_isrequired?: boolean;
  /** Category grouping for document types */
  prvc_category?: string;
  /** System created date */
  createdon?: Date;
  /** System modified date */
  modifiedon?: Date;
  /** Record status code (Active/Inactive) */
  statuscode?: number;
  /** Record state code */
  statecode?: number;
}

// DTOs for API operations

/**
 * Data transfer object for creating new submissions
 * Contains only the fields that can be set during creation
 */
export interface CreateSubmissionDto {
  /** Display name/title of the submission */
  prvc_name: string;
  /** Reference to account */
  'prvc_Account@odata.bind'?: string;
  /** Reference to primary contact */
  'prvc_PrimaryContact@odata.bind'?: string;
  /** Reference to document type */
  'prvc_DocumentType@odata.bind'?: string;
}

/**
 * Data transfer object for updating existing submissions
 * All fields are optional since this is for partial updates
 */
export interface UpdateSubmissionDto {
  /** Updated display name/title */
  prvc_name?: string;
  /** Updated description */
  prvc_description?: string;
  /** Updated status (option set value) */
  prvc_status?: number;
  /** Updated due date */
  prvc_duedate?: Date;
}

/**
 * Data transfer object for creating new document types
 * Contains only the fields that can be set during creation
 */
export interface CreateDocumentTypeDto {
  /** Name of the document type */
  prvc_name: string;
  /** Optional description */
  prvc_description?: string;
  /** Whether this document type is required */
  prvc_isrequired?: boolean;
  /** Category grouping */
  prvc_category?: string;
}

/**
 * Data transfer object for updating existing document types
 * All fields are optional since this is for partial updates
 */
export interface UpdateDocumentTypeDto {
  /** Updated name */
  prvc_name?: string;
  /** Updated description */
  prvc_description?: string;
  /** Updated required flag */
  prvc_isrequired?: boolean;
  /** Updated category */
  prvc_category?: string;
}

// Portal-specific types

/**
 * Simplified view of submissions for Power Pages portal display
 * Contains only the essential fields needed for list views
 */
export interface PortalSubmissionView {
  /** Submission ID for navigation */
  prvc_submissionid: string;
  /** Display name for the list */
  prvc_name: string;
  /** When it was created */
  createdon: Date;
  /** Current status for display */
  statuscode: number;
}

/**
 * Form data structure for Power Pages submission forms
 * Contains only the fields that portal users can input
 */
export interface PortalSubmissionForm {
  /** What the user is submitting */
  prvc_name: string;
  /** Optional details about the submission */
  prvc_description?: string;
  /** Type of document being submitted */
  prvc_documenttype?: string;
}

/**
 * Annotation/attachment entity - represents files uploaded to submissions
 * Standard Dataverse entity for file attachments
 */
export interface Attachment {
  /** Unique identifier for the annotation */
  annotationid?: string;
  /** Subject/title of the attachment */
  subject: string;
  /** File name with extension */
  filename?: string;
  /** MIME type of the file */
  mimetype?: string;
  /** File size in bytes */
  filesize?: number;
  /** Base64 encoded file content */
  documentbody?: string;
  /** ID of the related record (submission, contact, etc.) */
  objectid?: string;
  /** Type of the related record (prvc_submission, contact, etc.) */
  objecttypecode?: string;
  /** System created date */
  createdon?: Date;
  /** System modified date */
  modifiedon?: Date;
}

/**
 * DTO for uploading files
 * Used when creating new attachments
 */
export interface CreateAttachmentDto {
  /** Subject/title of the attachment */
  subject: string;
  /** File name with extension */
  filename: string;
  /** MIME type of the file */
  mimetype: string;
  /** Base64 encoded file content */
  documentbody: string;
  /** ID of the related record (navigation property) */
  'objectid_prvc_submission@odata.bind'?: string;
  /** Type of the related record */
  objecttypecode: string;
  /** Note text */
  notetext?: string;
  /** Is document flag */
  isdocument?: boolean;
}

/**
 * Simplified attachment view for portal display
 * Contains only essential fields for file lists
 */
export interface PortalAttachmentView {
  /** Attachment ID for download */
  annotationid: string;
  /** Display name */
  subject: string;
  /** File name */
  filename: string;
  /** File size for display */
  filesize: number;
  /** Upload date */
  createdon: Date;
}

/**
 * Account/Organization entity - standard Dataverse entity for companies/organizations
 * Used for organization registration and management
 */
export interface Account {
  /** Unique identifier for the account */
  accountid?: string;
  /** Organization name */
  name: string;
  /** Account number or reference */
  accountnumber?: string;
  /** Organization website */
  websiteurl?: string;
  /** Main phone number */
  telephone1?: string;
  /** Primary email address */
  emailaddress1?: string;
  /** Street address line 1 */
  address1_line1?: string;
  /** Street address line 2 */
  address1_line2?: string;
  /** City */
  address1_city?: string;
  /** State/Province */
  address1_stateorprovince?: string;
  /** Postal code */
  address1_postalcode?: string;
  /** Country */
  address1_country?: string;
  /** Organization description */
  description?: string;
  /** System created date */
  createdon?: Date;
  /** System modified date */
  modifiedon?: Date;
  /** Record status code (Active/Inactive) */
  statuscode?: number;
  /** Record state code */
  statecode?: number;
}

/**
 * DTO for creating new accounts/organizations
 * Contains only the fields that can be set during creation
 */
export interface CreateAccountDto {
  /** Organization name */
  name: string;
  /** Optional account number */
  accountnumber?: string;
  /** Optional website */
  websiteurl?: string;
  /** Optional phone */
  telephone1?: string;
  /** Optional email */
  emailaddress1?: string;
  /** Optional address fields */
  address1_line1?: string;
  address1_line2?: string;
  address1_city?: string;
  address1_stateorprovince?: string;
  address1_postalcode?: string;
  address1_country?: string;
  /** Optional description */
  description?: string;
}

/**
 * DTO for updating existing accounts
 * All fields are optional since this is for partial updates
 */
export interface UpdateAccountDto {
  /** Updated organization name */
  name?: string;
  /** Updated account number */
  accountnumber?: string;
  /** Updated website */
  websiteurl?: string;
  /** Updated phone */
  telephone1?: string;
  /** Updated email */
  emailaddress1?: string;
  /** Updated address fields */
  address1_line1?: string;
  address1_line2?: string;
  address1_city?: string;
  address1_stateorprovince?: string;
  address1_postalcode?: string;
  address1_country?: string;
  /** Updated description */
  description?: string;
}

/**
 * Simplified account view for portal display
 * Contains only essential fields for organization lists
 */
export interface PortalAccountView {
  /** Account ID for navigation */
  accountid: string;
  /** Organization name */
  name: string;
  /** Contact phone */
  telephone1?: string;
  /** Contact email */
  emailaddress1?: string;
  /** Registration date */
  createdon: Date;
}
