import express from 'express'
import { createFood, deleteFood, getSingleFood, getFoodItems, updateFood } from '../controllers/food.controller.js';
const foodRouter = express.Router();
import { authMiddleware, allowRoles, isFoodPartner } from '../middlewares/auth.middleware.js'
import multer from 'multer'

const upload = multer({
    storage: multer.memoryStorage(),
})

// food APIs
foodRouter.get('/', getFoodItems);
foodRouter.get('/:id', getSingleFood);
foodRouter.post('/create', authMiddleware, allowRoles("foodPartner"), upload.fields([
  { name: "video", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 }
]) , createFood);

foodRouter.put('/:id',authMiddleware, allowRoles("foodPartner"), isFoodPartner, updateFood);
foodRouter.delete('/:id', authMiddleware, allowRoles("foodPartner"), isFoodPartner, deleteFood );

export default foodRouter;