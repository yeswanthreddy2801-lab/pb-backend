import { Router } from 'express';
import * as deliveryController from '../controllers/delivery.controller';
import { deliveryAuth } from '../middleware/deliveryAuth';
import { authenticate } from '../middleware/authenticate';

const router = Router();

// Customer route (requires user auth)
router.get('/my-today', authenticate, deliveryController.getMyTodayDelivery);

// All routes below require delivery boy authentication
router.use(deliveryAuth);

router.get('/today', deliveryController.getTodayDeliveries);
router.get('/pending', deliveryController.getPendingDeliveries);
router.get('/completed', deliveryController.getCompletedDeliveries);
router.get('/stats', deliveryController.getDeliveryStats);
router.get('/customer/:deliveryId', deliveryController.getDeliveryDetails);

router.patch('/:deliveryId/status', deliveryController.updateDeliveryStatus);
router.patch('/:deliveryId/out-for-delivery', deliveryController.markOutForDelivery);

export default router;
