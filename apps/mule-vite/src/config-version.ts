import packageJson from '../package.json';

export const APP_VERSION = packageJson.version;
export const BUILD_DATE = packageJson.buildDate;
export const APP_ENV = import.meta.env.VITE_APP_ENV || 'Dev';
