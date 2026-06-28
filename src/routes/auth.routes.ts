import { Router } from 'express';
import { login, adminLogin, logout, getMe } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { userLoginSchema, adminLoginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', validate(userLoginSchema), login);
router.post('/admin/login', validate(adminLoginSchema), adminLogin);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);

export default router;
