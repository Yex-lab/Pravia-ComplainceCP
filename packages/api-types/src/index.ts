/**
 * Auto-generated API types, services, and slices
 * DO NOT EDIT MANUALLY
 */

// Core interfaces
export * from './core';

// Pravia Flux API
// Flux Microsoft Dataverse API for Pravia ecosystem
export * as FluxTypes from './api/flux/types';
export { createFluxServices } from './api/flux/services';
export type { FluxServices, FluxServiceConfig } from './api/flux/services';
export { createFluxSlices } from './api/flux/slices';
export type { FluxSlices } from './api/flux/slices';

// Pravia Foundry API
// Foundry Authorization API for Pravia ecosystem
export * as FoundryTypes from './api/foundry/types';
export { createFoundryServices } from './api/foundry/services';
export type { FoundryServices, FoundryServiceConfig } from './api/foundry/services';
export { createFoundrySlices } from './api/foundry/slices';
export type { FoundrySlices } from './api/foundry/slices';

// Pravia Incidents API
// Incidents Dataverse API for Pravia ecosystem
export * as IncidentsTypes from './api/incidents/types';
export { createIncidentsServices } from './api/incidents/services';
export type { IncidentsServices, IncidentsServiceConfig } from './api/incidents/services';
export { createIncidentsSlices } from './api/incidents/slices';
export type { IncidentsSlices } from './api/incidents/slices';

// API Version Information
export const API_VERSIONS = [
  {
    name: 'flux',
    version: '1.0.216',
    title: 'Pravia Flux API',
    description: 'Flux Microsoft Dataverse API for Pravia ecosystem',
    generatedAt: '2026-01-27T14:36:43.448Z',
  },
  {
    name: 'foundry',
    version: '1.0.585',
    title: 'Pravia Foundry API',
    description: 'Foundry Authorization API for Pravia ecosystem',
    generatedAt: '2026-01-27T14:36:44.385Z',
  },
  {
    name: 'incidents',
    version: '1.0.28',
    title: 'Pravia Incidents API',
    description: 'Incidents Dataverse API for Pravia ecosystem',
    generatedAt: '2026-01-27T14:36:45.401Z',
  },
] as const;
