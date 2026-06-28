import { Router } from 'express';
import * as foodItemsController from '../controllers/foodItems.controller';
import { validate } from '../middleware/validate';
import { foodItemIdParamSchema } from '../schemas/foodItem.schema';

const router = Router();

router.get('/', foodItemsController.getFoodItems);
router.get('/:id', validate(foodItemIdParamSchema), foodItemsController.getFoodItemById);

export default router;
