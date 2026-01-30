import log from 'loglevel';

// Environment-based configuration
const logLevel = (import.meta.env.VITE_LOG_LEVEL ?? 'info') as log.LogLevelDesc;
const isProduction = import.meta.env.MODE === 'production';
const defaultLevel = isProduction ? 'warn' : logLevel;

// Custom formatter using loglevel's methodFactory
const originalFactory = log.methodFactory;
log.methodFactory = function methodFactory(methodName, level, loggerName) {
  const rawMethod = originalFactory(methodName, level, loggerName);

  return function logMethod(message, ...args) {
    const timestamp = new Date().toISOString();
    const loggerPrefix = loggerName ? `[${String(loggerName)}]` : '';
    const prefix = `[${timestamp}] ${String(methodName).toUpperCase()}${loggerPrefix}:`;
    rawMethod(prefix, message, ...args);
  };
};

// Apply formatting to root logger
log.setLevel(defaultLevel);

// Named loggers with env-configurable levels
export const authLogger = log.getLogger('auth');
export const apiLogger = log.getLogger('api');
export const uiLogger = log.getLogger('ui');
export const errorLogger = log.getLogger('error');

// Set individual logger levels from env or defaults
authLogger.setLevel((import.meta.env.VITE_LOG_LEVEL_AUTH ?? 'debug') as log.LogLevelDesc);
apiLogger.setLevel((import.meta.env.VITE_LOG_LEVEL_API ?? 'info') as log.LogLevelDesc);
uiLogger.setLevel((import.meta.env.VITE_LOG_LEVEL_UI ?? 'info') as log.LogLevelDesc);
errorLogger.setLevel((import.meta.env.VITE_LOG_LEVEL_ERROR ?? 'error') as log.LogLevelDesc);

export default log;
