import express from "express";
import {
  addToRecommendedProducts,
  getRecommendedSellerProducts,
  getSingleRecommendedSellerProduct,
  removeRecommendedProduct,
  updateRecommendedProducts,
} from "../controllers/RecommendedSellerProductController";
import { verifySeller } from "../middleware/verifySeller";

// Default route === /recommendedProducts

export const recommendedProductRouter = express.Router();

recommendedProductRouter
  .route("/products/:productId")
  .get(getRecommendedSellerProducts)
  .post(verifySeller, addToRecommendedProducts)
  .patch(verifySeller, updateRecommendedProducts);

recommendedProductRouter
  .route("/:recommendedProductId/products/:productId")
  .get(getSingleRecommendedSellerProduct)
  .delete(verifySeller, removeRecommendedProduct);
