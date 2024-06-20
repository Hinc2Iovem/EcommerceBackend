import { RequestHandler } from "express";
import {
  BuyProductsService,
  addToCartService,
  clearCartByUserIdService,
  decreaseQuantityFromCartService,
  getAllCartsByUserIdService,
  removeFromCartService,
} from "../services/CartService";

export interface CartParams {
  userId: string;
}

export interface AddDecreaseCartParams {
  userId: string;
  productId: string;
}

export interface CartBody {
  quantity: number;
}

// @route GET http://localhost:3500/carts/users/:userId
// @access Private
export const getCartsByUserId: RequestHandler<
  CartParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const carts = await getAllCartsByUserIdService({
      userId: req.params.userId,
    });
    if (carts) {
      return res.status(200).json(carts);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

// @route PUT http://localhost:3500/carts/users/:userId/products/:productId
// @access Private
export const addToCart: RequestHandler<
  AddDecreaseCartParams,
  unknown,
  CartBody,
  unknown
> = async (req, res, next) => {
  try {
    const cart = await addToCartService({
      userId: req.params.userId,
      productId: req.params.productId,
      quantity: req.body.quantity,
    });
    if (cart) {
      return res.status(201).json(cart);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

// @route PATCH http://localhost:3500/carts/users/:userId/products/:productId
// @access Private
export const decreaseQuantityFromCart: RequestHandler<
  AddDecreaseCartParams,
  unknown,
  CartBody,
  unknown
> = async (req, res, next) => {
  try {
    const cart = await decreaseQuantityFromCartService({
      userId: req.params.userId,
      productId: req.params.productId,
      quantity: req.body.quantity,
    });
    if (cart) {
      return res.status(200).json(cart);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

type RemoveCartParams = {
  cartId: string;
};

// @route DELETE http://localhost:3500/carts/:cartId
// @access Private
export const removeFromCart: RequestHandler<
  RemoveCartParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const cart = await removeFromCartService({
      cartId: req.params.cartId,
    });
    if (cart) {
      return res.status(201).json(cart);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

type ClearCartParams = {
  userId: string;
};

// @route DELETE http://localhost:3500/carts/users/:userId
// @access Private
export const clearCartByUserId: RequestHandler<
  ClearCartParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const cart = await clearCartByUserIdService({
      userId: req.params.userId,
    });
    if (cart) {
      return res.status(201).json(cart);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

// @route DELETE http://localhost:3500/carts/checkout/users/:userId
// @access Private
export const BuyProducts: RequestHandler<
  CartParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const cart = await BuyProductsService({
      userId: req.params.userId,
    });
    if (cart) {
      return res.status(201).json(cart);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};
