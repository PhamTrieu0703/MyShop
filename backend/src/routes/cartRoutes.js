import express from "express";
import { getCarts,getCartByUser,clearCartByUser,updateCartQuantity,addToCartById, removeCartItem } from "../controllers/cartController.js";

const router = express.Router();
router.get("/", getCarts);
router.get('/:userId', getCartByUser);
router.post("/:userId", addToCartById);
router.put("/:id", updateCartQuantity); 
router.delete("/", clearCartByUser);
router.delete("/:id", removeCartItem);
export default router;