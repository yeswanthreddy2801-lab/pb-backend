import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticate } from '../middleware/authenticate';
import { adminOnly } from '../middleware/adminOnly';
import { validate } from '../middleware/validate';
import { 
  orderIdParamSchema, 
  rejectOrderSchema,
  createPlanSchema,
  updatePlanSchema,
  planIdParamSchema
} from '../schemas/admin.schema';
import { 
  createFoodItemSchema, 
  updateFoodItemSchema, 
  foodItemIdParamSchema 
} from '../schemas/foodItem.schema';

const router = Router();

router.use(authenticate, adminOnly);

// Stats
router.get('/stats', adminController.getStats);

// Orders
router.get('/orders', adminController.getOrders);
router.get('/orders/:id', validate(orderIdParamSchema), adminController.getOrderById);
router.patch('/orders/:id/approve', validate(orderIdParamSchema), adminController.approveOrder);
router.patch('/orders/:id/reject', validate(rejectOrderSchema), adminController.rejectOrder);

// Customers
router.get('/customers', adminController.getCustomers);
router.get('/customers/:id', adminController.getCustomerById);

// Inventory
router.get('/inventory', adminController.getInventory);
router.post('/inventory', validate(createFoodItemSchema), adminController.createFoodItem);
router.patch('/inventory/:id', validate(updateFoodItemSchema), adminController.updateFoodItem);
router.delete('/inventory/:id', validate(foodItemIdParamSchema), adminController.deleteFoodItem);
router.patch('/inventory/:id/toggle', validate(foodItemIdParamSchema), adminController.toggleFoodItemAvailability);

// Subscription Plans
router.get('/plans', adminController.getPlans);
router.post('/plans', validate(createPlanSchema), adminController.createPlan);
router.patch('/plans/:id', validate(updatePlanSchema), adminController.updatePlan);
router.delete('/plans/:id', validate(planIdParamSchema), adminController.deletePlan);

export default router;
