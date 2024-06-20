import createHttpError from "http-errors";
import Favourite from "../models/Favourite";
import Product from "../models/Product";
import User from "../models/User";
import { validateMongoId } from "../utils/validateMongoId";
import { valueExists } from "../utils/valueExists";

export interface AddDecreaseToFavouriteServiceTypes {
  userId: string;
  productId: string;
}

export const getAllFavouritesByUserIdService = async ({
  userId,
}: {
  userId: string;
}) => {
  validateMongoId({ value: userId, valueName: "userId" });

  const favourites = await Favourite.find({ userId }).lean();
  if (!favourites || !favourites.length) {
    return [];
  }
  return favourites;
};

export const getFavouriteByProductIdAndUserIdService = async ({
  userId,
  productId,
}: {
  userId: string;
  productId: string;
}) => {
  validateMongoId({ value: userId, valueName: "userId" });
  validateMongoId({ value: productId, valueName: "productId" });

  const favourite = await Favourite.findOne({ userId, productId }).lean();
  if (!favourite) {
    return null;
  }
  return favourite;
};

export const addToFavouriteService = async ({
  userId,
  productId,
}: AddDecreaseToFavouriteServiceTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });
  validateMongoId({ value: userId, valueName: "userId" });

  const existingUser = await User.findById(userId).select("-password").lean();
  valueExists({ value: existingUser, valueName: "User" });

  const existingProduct = await Product.findById(productId).lean();
  valueExists({ value: existingProduct, valueName: "Product" });

  const existingFavourite = await Favourite.findOne({
    productId,
    userId,
  }).lean();
  if (existingFavourite) {
    throw createHttpError(400, "Favourite has been already added");
  }
  return await Favourite.create({ userId, productId });
};

export interface RemoveFromFavouriteServiceTypes {
  userId: string;
  productId: string;
}

export const removeFromFavouriteService = async ({
  userId,
  productId,
}: RemoveFromFavouriteServiceTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });
  validateMongoId({ value: userId, valueName: "userId" });

  const favourite = await Favourite.findOne({ userId, productId }).exec();
  valueExists({ value: favourite, valueName: "Favourite" });

  await favourite!.deleteOne();

  return `Item with id ${productId} was removed from the favourite`;
};
