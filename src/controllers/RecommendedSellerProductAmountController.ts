import { RequestHandler } from "express";
import { getRecommendedSellerProductsAmountService } from "../services/RecommendedSellerProductAmountService";

export interface RecommendedProductsAmountParams {
  productId: string;
}

// @route GET http://localhost:3500/recommendedProductsAmount/products/:productId
// @access Private
export const getRecommendedSellerProductsAmount: RequestHandler<
  RecommendedProductsAmountParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const amount = await getRecommendedSellerProductsAmountService({
      productId: req.params.productId,
    });
    if (amount) {
      return res.status(200).json(amount);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};
