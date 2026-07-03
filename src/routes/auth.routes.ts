import { Router } from 'express';
import { login, adminLogin, logout, getMe, changeAdminPassword } from '../controllers/auth.controller';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/authenticate';
import { adminOnly } from '../middleware/adminOnly';
import { userLoginSchema, adminLoginSchema, changeAdminPasswordSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/login', validate(userLoginSchema), login);
router.post('/admin/login', validate(adminLoginSchema), adminLogin);
router.post('/logout', logout);
router.get('/me', authenticate, getMe);
router.patch('/admin/password', authenticate, adminOnly, validate(changeAdminPasswordSchema), changeAdminPassword);

export default router;
