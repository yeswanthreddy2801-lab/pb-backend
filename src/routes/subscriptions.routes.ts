import { Router } from 'express';
import * as subscriptionsController from '../controllers/subscriptions.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import {
  createSubscriptionSchema,
  subscriptionIdParamSchema
} from '../schemas/subscription.schema';

const router = Router();

router.use(authenticate);

router.get('/my', subscriptionsController.getMySubscriptions);
router.post('/', validate(createSubscriptionSchema), subscriptionsController.createSubscription);
router.get('/:id', validate(subscriptionIdParamSchema), subscriptionsController.getSubscriptionById);
router.post('/:id/renew', validate(subscriptionIdParamSchema), subscriptionsController.renewSubscription);

export default router;
