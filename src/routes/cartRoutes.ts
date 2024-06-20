import express from "express";
import {
  BuyProducts,
  addToCart,
  clearCartByUserId,
  decreaseQuantityFromCart,
  getCartsByUserId,
  removeFromCart,
} from "../controllers/CartController";
import { verifyJWT } from "../middleware/verifyJWT";

// Default route === /carts

export const cartRouter = express.Router();

cartRouter
  .route("/users/:userId")
  .get(getCartsByUserId)
  .delete(verifyJWT, clearCartByUserId);

cartRouter
  .route("/users/:userId/products/:productId")
  .put(verifyJWT, addToCart)
  .patch(verifyJWT, decreaseQuantityFromCart);

cartRouter.route("/:cartId").delete(verifyJWT, removeFromCart);

cartRouter.route("/checkout/users/:userId").delete(verifyJWT, BuyProducts);
