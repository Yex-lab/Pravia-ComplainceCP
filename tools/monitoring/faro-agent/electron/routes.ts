import { FastifyInstance } from 'fastify';
import { dbService } from './database';
import axios from 'axios';

export async function registerRoutes(fastify: FastifyInstance) {
  // Health check
  fastify.get('/api/health', async () => {
    return { status: 'ok', timestamp: Date.now() };
  });

  // Get all services
  fastify.get('/api/services', async () => {
    return dbService.getAll();
  });

  // Get service by ID
  fastify.get('/api/services/:id', async (request) => {
    const { id } = request.params as any;
    return dbService.getById(id);
  });

  // Create service
  fastify.post('/api/services', async (request) => {
    const service = request.body as any;
    dbService.create(service);
    return service;
  });

  // Update service
  fastify.put('/api/services/:id', async (request) => {
    const { id } = request.params as any;
    const data = request.body as any;
    dbService.update(id, data);
    return { ...data, id };
  });

  // Delete service
  fastify.delete('/api/services/:id', async (request) => {
    const { id } = request.params as any;
    dbService.delete(id);
    return { success: true };
  });

  // Health check endpoint
  fastify.post('/api/check-health', async (request) => {
    const { url } = request.body as any;
    const start = Date.now();
    
    try {
      const response = await axios.get(url, { timeout: 5000 });
      return {
        status: response.status === 200 ? 'healthy' : 'degraded',
        responseTime: Date.now() - start,
        timestamp: Date.now()
      };
    } catch (error) {
      return {
        status: 'down',
        responseTime: Date.now() - start,
        timestamp: Date.now(),
        error: error instanceof Error ? error.message : 'Unknown'
      };
    }
  });
}
