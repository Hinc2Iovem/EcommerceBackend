import express from "express";
import {
  addToFavourite,
  getFavouriteByProductIdAndUserId,
  getFavouritesByUserId,
  removeFromFavourite,
} from "../controllers/FavouriteController";
import { verifyJWT } from "../middleware/verifyJWT";

// Default route === /favourite

export const favouriteRouter = express.Router();

favouriteRouter.route("/users/:userId").get(getFavouritesByUserId);

favouriteRouter
  .route("/:productId/users/:userId")
  .get(getFavouriteByProductIdAndUserId)
  .post(verifyJWT, addToFavourite)
  .delete(verifyJWT, removeFromFavourite);
