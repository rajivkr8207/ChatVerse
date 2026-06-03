import request from 'supertest';
import app from '../src/app.js';

describe('Healthcheck API', () => {
  it('should return 200 OK from /api/health', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe("Health check passed");
    expect(res.body.data.message).toBe("OK");
  });

  it('should return 200 OK from root /health endpoint', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe("your server health is Correct correctly");
  });
});
