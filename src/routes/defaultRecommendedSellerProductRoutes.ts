import express from "express";
import {
  getDefaultRecommendedProductsSellerProducts,
  getDefaultRecommendedSingleProductSeller,
  makeDefaultRecommendedProducts,
  removeDefaultRecommendedProduct,
  updateDefaultRecommendedProducts,
} from "../controllers/DefaultRecommendedSellerProductController";
import { verifySeller } from "../middleware/verifySeller";

// Default route === /defaultRecommendedProducts

export const defaultRecommendedProductRouter = express.Router();

defaultRecommendedProductRouter
  .route("/sellers/:sellerId")
  .get(getDefaultRecommendedProductsSellerProducts)
  .put(verifySeller, makeDefaultRecommendedProducts)
  .patch(verifySeller, updateDefaultRecommendedProducts);

defaultRecommendedProductRouter
  .route("/products/:productId/sellers/:sellerId")
  .delete(verifySeller, removeDefaultRecommendedProduct);

defaultRecommendedProductRouter
  .route("/products/:productId")
  .get(getDefaultRecommendedSingleProductSeller);
