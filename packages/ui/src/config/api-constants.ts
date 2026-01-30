/**
 * API endpoint constants for local development
 */

export const API_PORTS = {
  FOUNDRY: 4000,      // Authorization API
  FLUX: 4001,      // Dataverse API
  FORGE: 4002,      // Forge API (file upload) 
  NEXUS: 4003,      // Forge API (file upload) 
  HELIX: 4004,      // Helix API (n8n integration)
  CORTEX: 4005,     // Cortex API (Matrix/knowledge bases)
  N8N: 5678,        // n8n workflow automation
} as const;

export const API_URLS = {
  // CORTEX: `http://localhost:${API_PORTS.CORTEX}/api`,
  CORTEX: `http://localhost:${API_PORTS.CORTEX}/api/v1`,
  FLUX: `http://localhost:${API_PORTS.FLUX}/api`,
  FORGE: `http://localhost:${API_PORTS.FORGE}/api`,
  FOUNDRY: `http://localhost:${API_PORTS.FOUNDRY}/api`,
  HELIX: `http://localhost:${API_PORTS.HELIX}/api`,
  NEXUS: `http://localhost:${API_PORTS.NEXUS}/api`,
  N8N: `http://localhost:${API_PORTS.N8N}`,
} as const;

/**
 * @deprecated Use API_URLS.CORTEX instead
 */
export const MATRIX_API_URL = API_URLS.CORTEX;
