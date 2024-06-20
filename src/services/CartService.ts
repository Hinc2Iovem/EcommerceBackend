import createHttpError from "http-errors";
import BoughtProduct from "../models/BoughtProduct";
import Cart from "../models/Cart";
import Product from "../models/Product";
import SoldProduct from "../models/SoldProduct";
import User from "../models/User";
import { validateMongoId } from "../utils/validateMongoId";
import { valueExists } from "../utils/valueExists";

export interface AddDecreaseToCartServiceTypes {
  userId: string;
  productId: string;
  quantity: number;
}

export const getAllCartsByUserIdService = async ({
  userId,
}: {
  userId: string;
}) => {
  const carts = await Cart.find({ userId }).lean();
  if (!carts || !carts.length) {
    return [];
  }
  return carts;
};

export const addToCartService = async ({
  userId,
  productId,
  quantity,
}: AddDecreaseToCartServiceTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });
  validateMongoId({ value: userId, valueName: "userId" });

  const existingUser = await User.findById(userId).select("-password").lean();
  valueExists({ value: existingUser, valueName: "User" });

  const existingProduct = await Product.findById(productId).lean();
  valueExists({ value: existingProduct, valueName: "Product" });

  const existingItemInCart = await Cart.findOne({ userId, productId }).exec();
  if (existingItemInCart) {
    if (existingItemInCart.quantity) {
      existingItemInCart.quantity += quantity;
      if (existingItemInCart.totalPrice) {
        existingItemInCart.totalPrice += existingProduct!.price;
      }
    }
    return await existingItemInCart.save();
  }

  const cart = await Cart.create({
    userId,
    productId,
    quantity,
    totalPrice: existingProduct!.price,
  });
  return cart;
};

export const decreaseQuantityFromCartService = async ({
  userId,
  productId,
  quantity,
}: AddDecreaseToCartServiceTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });
  validateMongoId({ value: userId, valueName: "userId" });

  const existingUser = await User.findById(userId).select("-password").lean();
  valueExists({ value: existingUser, valueName: "User" });

  const existingProduct = await Product.findById(productId).lean();
  valueExists({ value: existingProduct, valueName: "Product" });

  const existingItemInCart = await Cart.findOne({ userId, productId }).exec();
  if (existingItemInCart) {
    if (
      existingItemInCart.quantity &&
      existingItemInCart.quantity - quantity >= 1
    ) {
      existingItemInCart.quantity -= quantity;
      if (existingItemInCart.totalPrice) {
        existingItemInCart.totalPrice -= existingProduct!.price;
      }
      return await existingItemInCart.save();
    } else if (
      existingItemInCart.quantity &&
      existingItemInCart.quantity - quantity < 1
    ) {
      await existingItemInCart.deleteOne();
      return `Item with id ${productId} was removed from the cart`;
    }
  }
};

export interface RemoveFromCartServiceTypes {
  cartId: string;
}

export const removeFromCartService = async ({
  cartId,
}: RemoveFromCartServiceTypes) => {
  validateMongoId({ value: cartId, valueName: "cartId" });

  const existingCart = await Cart.findById(cartId).lean();
  valueExists({ value: existingCart, valueName: "Cart" });

  await Cart.findById(cartId).deleteOne();
  return `Cart with id ${cartId} was removed`;
};

export interface ClearCartByUserIdServiceTypes {
  userId: string;
}

export const clearCartByUserIdService = async ({
  userId,
}: ClearCartByUserIdServiceTypes) => {
  validateMongoId({ value: userId, valueName: "userId" });

  const existingCart = await Cart.find({ userId }).lean();
  if (!existingCart || !existingCart.length) {
    throw createHttpError(404, "Cart with such userId wasn't found");
  }

  await Cart.find({ userId }).deleteMany();
  return `Cart with id ${userId} was cleaned`;
};

export interface AddCheckoutCartServiceTypes {
  userId: string;
}

export const BuyProductsService = async ({
  userId,
}: AddCheckoutCartServiceTypes) => {
  validateMongoId({ value: userId, valueName: "userId" });
  const existingUser = await User.findById(userId).select("-password").exec();
  valueExists({ value: existingUser, valueName: "User" });

  const userCart = await Cart.find({ userId }).lean();

  for (const u of userCart) {
    const currentProduct = await Product.findById(u.productId).lean();
    const currentSeller = await User.findById(currentProduct?.userId)
      .select("-password")
      .exec();
    const currentQuantity = u.quantity;

    const Money =
      (currentQuantity ? currentQuantity : 1) * currentProduct!.price;
    if (currentSeller) {
      currentSeller.balance += Money;
    }

    if (existingUser) {
      if (existingUser.balance - Money < 0 || existingUser.balance == 0) {
        return "Not Enough Money";
      } else {
        existingUser.balance -= Money;
      }
    }

    const alreadySoldProduct = await SoldProduct.findOne({
      userId,
      productId: u.productId,
    });
    if (alreadySoldProduct && alreadySoldProduct.quantity) {
      alreadySoldProduct.quantity += 1;
      await alreadySoldProduct.save();
    } else {
      await SoldProduct.create({
        userId: currentProduct?.userId,
        quantity: currentQuantity,
        productId: u.productId,
      });
    }

    const alreadyBoughtProduct = await BoughtProduct.findOne({
      userId,
      productId: u.productId,
    });
    if (alreadyBoughtProduct && alreadyBoughtProduct.quantity) {
      alreadyBoughtProduct.quantity += 1;
      await alreadyBoughtProduct.save();
    } else {
      await BoughtProduct.create({
        userId: userId,
        quantity: currentQuantity,
        productId: u.productId,
      });
    }

    if (existingUser) {
      await existingUser.save();
    }
    if (currentSeller) {
      await currentSeller.save();
    }
    await Cart.findByIdAndDelete(u._id);
  }

  return `Checked out`;
};
