import express from 'express'
const cartRouter = express.Router();
import { authMiddleware, allowRoles } from '../middlewares/auth.middleware.js'
import { addToCart, getCart, removeFromCart, updateQuantity } from '../controllers/cart.controller.js';

cartRouter.post("/",authMiddleware, allowRoles("user"), addToCart);
cartRouter.get("/",authMiddleware, allowRoles("user"), getCart);
cartRouter.delete("/:foodId",authMiddleware, allowRoles("user"), removeFromCart);
cartRouter.patch("/",authMiddleware, allowRoles("user"), updateQuantity);

export default cartRouter;