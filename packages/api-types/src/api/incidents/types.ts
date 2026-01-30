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

export interface IncidentDto {
  /** Incident ID */
  id: string;
  /** Incident name */
  name?: string;
  /** State code */
  stateCode?: number;
  /** Status code */
  statusCode?: number;
  /** Account ID */
  accountId?: string;
  /** Contact ID */
  contactId?: string;
  /** Breach type reported to AG */
  breachTypeReportedToAg?: number;
  /** CYDO */
  cydo?: number;
  /** Date opened */
  dateOpened?: string;
  /** Date closed */
  dateClosed?: string;
  /** Incident type */
  incidentType?: number;
  /** Severity rating */
  severityRating?: number;
  /** Status of case */
  statusOfCase?: number;
  /** Customer email */
  customerEmail?: string;
  /** Customer phone */
  customerPhone?: string;
  /** City */
  city?: string;
  /** Source */
  source?: string;
  /** Cyber insurance */
  cyberInsurance?: boolean;
  /** Self reported */
  selfReported?: boolean;
  /** Summary CCIR */
  summaryCcir?: string;
  /** Data loss summary */
  dataLossSummary?: string;
  /** Incident description */
  incidentDescription?: string;
  /** Account details */
  account?: object;
  /** Contact details */
  contact?: object;
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

export interface CreateIncidentDto {
  /** Incident name */
  name?: string;
  /** Account ID */
  accountId?: string;
  /** Contact ID */
  contactId?: string;
  /** Breach type reported to AG */
  breachTypeReportedToAg?: number;
  /** CYDO */
  cydo?: number;
  /** Incident description (plain text) */
  incidentDescription?: string;
}

export interface UpdateIncidentDto {
  /** Incident type */
  incidentType?: number;
  /** Incident description (plain text) */
  incidentDescription?: string;
}

export type Object = object;
