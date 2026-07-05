import { Router } from 'express';
import { loginDeliveryBoy } from '../controllers/deliveryAuth.controller';
import { validate } from '../middleware/validate';
import { z } from 'zod';

const router = Router();

const loginSchema = z.object({
  body: z.object({
    mobile: z.string().length(10, 'Mobile must be 10 digits'),
    password: z.string().min(1, 'Password is required')
  })
});

router.post('/login', validate(loginSchema), loginDeliveryBoy);

export default router;
