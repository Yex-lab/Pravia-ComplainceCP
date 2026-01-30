/**
 * HTTP Status Codes with descriptions
 * Use these constants for consistent status code handling across all APIs
 */

export const HTTP_STATUS = {
  // 2xx Success
  OK: {
    code: 200,
    message: 'OK',
    description: 'The request succeeded',
  },
  CREATED: {
    code: 201,
    message: 'Created',
    description: 'The request succeeded and a new resource was created',
  },
  ACCEPTED: {
    code: 202,
    message: 'Accepted',
    description: 'The request has been accepted for processing',
  },
  NO_CONTENT: {
    code: 204,
    message: 'No Content',
    description: 'The request succeeded but there is no content to return',
  },

  // 3xx Redirection
  MOVED_PERMANENTLY: {
    code: 301,
    message: 'Moved Permanently',
    description: 'The resource has been moved permanently',
  },
  FOUND: {
    code: 302,
    message: 'Found',
    description: 'The resource has been found at a different URI',
  },
  NOT_MODIFIED: {
    code: 304,
    message: 'Not Modified',
    description: 'The resource has not been modified since last request',
  },

  // 4xx Client Errors
  BAD_REQUEST: {
    code: 400,
    message: 'Bad Request',
    description: 'The request could not be understood or was missing required parameters',
  },
  UNAUTHORIZED: {
    code: 401,
    message: 'Unauthorized',
    description: 'Authentication is required and has failed or not been provided',
  },
  FORBIDDEN: {
    code: 403,
    message: 'Forbidden',
    description: 'The request is understood but refused or access is not allowed',
  },
  NOT_FOUND: {
    code: 404,
    message: 'Not Found',
    description: 'The requested resource could not be found',
  },
  METHOD_NOT_ALLOWED: {
    code: 405,
    message: 'Method Not Allowed',
    description: 'The request method is not supported for this resource',
  },
  NOT_ACCEPTABLE: {
    code: 406,
    message: 'Not Acceptable',
    description: 'The requested resource cannot generate acceptable content',
  },
  REQUEST_TIMEOUT: {
    code: 408,
    message: 'Request Timeout',
    description: 'The server timed out waiting for the request',
  },
  CONFLICT: {
    code: 409,
    message: 'Conflict',
    description: 'The request conflicts with the current state of the server',
  },
  GONE: {
    code: 410,
    message: 'Gone',
    description: 'The requested resource is no longer available',
  },
  UNPROCESSABLE_ENTITY: {
    code: 422,
    message: 'Unprocessable Entity',
    description: 'The request was well-formed but contains semantic errors',
  },
  TOO_MANY_REQUESTS: {
    code: 429,
    message: 'Too Many Requests',
    description: 'The user has sent too many requests in a given amount of time (rate limiting)',
  },

  // 5xx Server Errors
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: 'Internal Server Error',
    description: 'An unexpected error occurred on the server',
  },
  NOT_IMPLEMENTED: {
    code: 501,
    message: 'Not Implemented',
    description: 'The server does not support the functionality required',
  },
  BAD_GATEWAY: {
    code: 502,
    message: 'Bad Gateway',
    description: 'The server received an invalid response from an upstream server',
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    message: 'Service Unavailable',
    description: 'The server is temporarily unable to handle the request',
  },
  GATEWAY_TIMEOUT: {
    code: 504,
    message: 'Gateway Timeout',
    description: 'The server did not receive a timely response from an upstream server',
  },
} as const;

/**
 * Type for HTTP status codes
 */
export type HttpStatusCode = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]['code'];

/**
 * Helper to get status details by code
 */
export const getStatusDetails = (code: number) => {
  return Object.values(HTTP_STATUS).find((status) => status.code === code);
};

/**
 * Check if status code is successful (2xx)
 */
export const isSuccessStatus = (code: number): boolean => {
  return code >= 200 && code < 300;
};

/**
 * Check if status code is client error (4xx)
 */
export const isClientError = (code: number): boolean => {
  return code >= 400 && code < 500;
};

/**
 * Check if status code is server error (5xx)
 */
export const isServerError = (code: number): boolean => {
  return code >= 500 && code < 600;
};
