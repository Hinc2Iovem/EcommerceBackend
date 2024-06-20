import { RequestHandler } from "express";
import {
  addToFavouriteService,
  getAllFavouritesByUserIdService,
  getFavouriteByProductIdAndUserIdService,
  removeFromFavouriteService,
} from "../services/FavouriteService";

export interface FavouriteParams {
  userId: string;
  productId: string;
}

// @route GET http://localhost:3500/favourite/users/:userId
// @access PRIVATE
export const getFavouritesByUserId: RequestHandler<
  FavouriteParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const favourites = await getAllFavouritesByUserIdService({
      userId: req.params.userId,
    });
    if (favourites) {
      return res.status(200).json(favourites);
    } else {
      return null;
    }
  } catch (error) {
    next(error);
  }
};

// @route GET http://localhost:3500/favourite/:productId/users/:userId
// @access PRIVATE
export const getFavouriteByProductIdAndUserId: RequestHandler<
  FavouriteParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const favourite = await getFavouriteByProductIdAndUserIdService({
      userId: req.params.userId,
      productId: req.params.productId,
    });
    if (favourite) {
      return res.status(200).json(favourite);
    } else {
      return null;
    }
  } catch (error) {
    next(error);
  }
};

// @route POST http://localhost:3500/favourite/:productId/users/:userId
// @access PRIVATE
export const addToFavourite: RequestHandler<
  FavouriteParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const favourite = await addToFavouriteService({
      userId: req.params.userId,
      productId: req.params.productId,
    });
    if (favourite) {
      return res.status(201).json(favourite);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

// @route DELETE http://localhost:3500/favourite/:productId/users/:userId
// @access PRIVATE
export const removeFromFavourite: RequestHandler<
  FavouriteParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const favourite = await removeFromFavouriteService({
      userId: req.params.userId,
      productId: req.params.productId,
    });
    if (favourite) {
      return res.status(201).json(favourite);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};
