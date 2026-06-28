import request from 'supertest';
import app from '../src/app';

jest.mock('../src/config/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: [], error: null }),
  }
}));

// Mock authenticate middleware
jest.mock('../src/middleware/authenticate', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { userId: 'mock-user-id', role: 'user' };
    next();
  }
}));

describe('Subscriptions API', () => {
  it('should return 400 when missing required fields', async () => {
    const res = await request(app)
      .post('/api/subscriptions')
      .send({});
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});
