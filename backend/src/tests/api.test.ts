import request from 'supertest';
import app from '../index'; // Import Express app without starting the server
import { createServer } from 'http';

// We need to close the server and DB connections after testing
const server = createServer(app);

beforeAll((done) => {
  server.listen(0, done); // Bind to random port
});

afterAll((done) => {
  server.close(done);
});

describe('Public API Endpoints', () => {
  it('GET /api/health should return 200 OK', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body).toHaveProperty('timestamp');
  });

  it('GET /api/listings should return a list of listings', async () => {
    const res = await request(app).get('/api/listings?limit=5');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('listings');
    expect(res.body).toHaveProperty('pagination');
    expect(Array.isArray(res.body.listings)).toBe(true);
    expect(res.body.listings.length).toBeLessThanOrEqual(5);
  });
});
