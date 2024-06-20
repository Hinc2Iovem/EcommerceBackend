import { RequestHandler } from "express";
import { getDefaultRecommendedSellerProductsAmountService } from "../services/DefaultRecommendedSellerProductAmountService";

type DefaultRecommendedProductsTypes = {
  sellerId: string;
};

type DefaultRecommendedProductsBodyTypes = {
  category: string;
  subCategory: string;
};

// @route GET http://localhost:3500/defaultRecommendedProductsAmount/sellers/:sellerId
// @access Private
export const getDefaultRecommendedSellerProductsAmount: RequestHandler<
  DefaultRecommendedProductsTypes,
  unknown,
  unknown,
  DefaultRecommendedProductsBodyTypes
> = async (req, res, next) => {
  try {
    const amount = await getDefaultRecommendedSellerProductsAmountService({
      sellerId: req.params.sellerId,
      category: req.query.category,
      subCategory: req.query.subCategory,
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
