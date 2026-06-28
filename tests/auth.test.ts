import request from 'supertest';
import app from '../src/app';
import { supabase } from '../src/config/supabase';

// Mock supabase client to prevent real DB connections during basic tests
jest.mock('../src/config/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { id: 'test-id', mobile: '1234567890', is_new_user: true }, error: null }),
  }
}));

describe('Auth API', () => {
  it('should return 400 if mobile number is invalid', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ mobile: '123' });
    
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should return token on valid login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ mobile: '1234567890' });
    
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('token');
  });
});
