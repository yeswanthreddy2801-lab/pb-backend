import { Router } from 'express';
import * as usersController from '../controllers/users.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import {
  updateUserSchema,
  createAddressSchema,
  updateAddressSchema,
  addressIdParamSchema
} from '../schemas/user.schema';

const router = Router();

router.use(authenticate);

router.get('/me', usersController.getMe);
router.patch('/me', validate(updateUserSchema), usersController.updateMe);

router.get('/me/addresses', usersController.getAddresses);
router.post('/me/addresses', validate(createAddressSchema), usersController.createAddress);
router.patch('/me/addresses/:id', validate(updateAddressSchema), usersController.updateAddress);
router.delete('/me/addresses/:id', validate(addressIdParamSchema), usersController.deleteAddress);
router.patch('/me/addresses/:id/set-default', validate(addressIdParamSchema), usersController.setDefaultAddress);

export default router;
