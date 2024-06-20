import express from "express";
import { getDefaultRecommendedSellerProductsAmount } from "../controllers/DefaultRecommendedSellerProductAmountController";

// Default route === /defaultRecommendedProductsAmount

export const defaultRecommendedProductAmountRouter = express.Router();

defaultRecommendedProductAmountRouter
  .route("/sellers/:sellerId")
  .get(getDefaultRecommendedSellerProductsAmount);
