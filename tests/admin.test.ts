import request from 'supertest';
import app from '../src/app';

jest.mock('../src/config/supabase', () => ({
  supabase: {
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { stats: {} }, error: null }),
  }
}));

// Mock authenticate and adminOnly middleware
jest.mock('../src/middleware/authenticate', () => ({
  authenticate: (req: any, res: any, next: any) => {
    req.user = { adminId: 'mock-admin-id', role: 'admin' };
    next();
  }
}));

jest.mock('../src/middleware/adminOnly', () => ({
  adminOnly: (req: any, res: any, next: any) => {
    next();
  }
}));

describe('Admin API', () => {
  it('should allow access to admin routes if authenticated as admin', async () => {
    // Note: this test uses mocked DB calls
    const res = await request(app).get('/api/admin/stats');
    expect(res.status).toBe(200); // Because we mocked everything to succeed
  });
});
