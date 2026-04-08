import fastify from 'fastify';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

const server = fastify({ logger: true });

async function buildServer() {
  await server.register(cors, { origin: '*' });
  
  await server.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute'
  });

  server.addHook('onRequest', async (request, reply) => {
    // API KEY Auth Stub
    const apiKey = request.headers['x-api-key'];
    if (!apiKey) {
      // reply.code(401).send({ error: 'Missing API Key' });
    }
  });

  // Healthcheck
  server.get('/health', async () => {
    return { status: 'ok', service: 'uzo_api_gateway' };
  });

  // Core API Contracts
  server.post('/v1/route', async (request, reply) => {
    // Proxy to atlas_core or mock response
    return { 
      route: { distance: 15200, duration: 1800, polyline: '...', eta: 1800 },
      status: 'success'
    };
  });

  server.post('/v1/matrix', async (request, reply) => {
    return { 
      matrix: [[0, 1500], [1500, 0]],
      sources: [...(request.body as any)?.sources || []],
      destinations: [...(request.body as any)?.destinations || []],
      status: 'success'
    };
  });

  server.post('/v1/geocode', async (request, reply) => {
    const { query } = request.body as any;
    return { 
      results: [{ formatted: `${query} Landmark`, lat: 6.5244, lng: 3.3792 }],
      status: 'success'
    };
  });

  server.post('/v1/reverse-geocode', async (request, reply) => {
    return { 
      results: [{ formatted: 'Lagos Mainland, Nigeria', type: 'city' }],
      status: 'success'
    };
  });

  server.get('/v1/tiles/:z/:x/:y', async (request, reply) => {
    // Proxy tile request to atlas source
    return reply.type('image/png').send(Buffer.from(''));
  });

  server.post('/v1/telemetry', async (request, reply) => {
    // Push event to Kafka/NATS stub
    return { status: 'received' };
  });

  return server;
}

buildServer()
  .then(app => app.listen({ port: process.env.PORT ? parseInt(process.env.PORT) : 3001, host: '0.0.0.0' }))
  .catch(err => {
    server.log.error(err);
    process.exit(1);
  });
