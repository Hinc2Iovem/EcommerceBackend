import express from "express";
import { getRecommendedSellerProductsAmount } from "../controllers/RecommendedSellerProductAmountController";

// Default route === /recommendedProductsAmount

export const recommendedProductAmountRouter = express.Router();

recommendedProductAmountRouter
  .route("/products/:productId")
  .get(getRecommendedSellerProductsAmount);
