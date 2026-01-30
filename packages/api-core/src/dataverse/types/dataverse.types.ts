export interface DataverseQueryOptions {
  select?: string[];
  filter?: string;
  orderBy?: string;
  top?: number;
  skip?: number;
  expand?: string[];
}

export type QueryOptions = DataverseQueryOptions;

export type DataverseRecord = Record<string, unknown>;

export interface DataverseResponse<T = DataverseRecord> {
  value: T[];
  '@odata.context'?: string;
  '@odata.count'?: number;
  '@odata.nextLink'?: string;
}

export interface DataverseEntity {
  [key: string]: unknown;
}
