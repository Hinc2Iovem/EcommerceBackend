import createHttpError from "http-errors";
import DefaultRecommendedSellerProductAmount from "../models/DefaultRecommendedSellerProductAmount";
import { validateMongoId } from "../utils/validateMongoId";

type DefaultRecommendedProductsTypes = {
  sellerId: string;
  category: string;
  subCategory: string;
};

export const getDefaultRecommendedSellerProductsAmountService = async ({
  sellerId,
  category,
  subCategory,
}: DefaultRecommendedProductsTypes) => {
  validateMongoId({ value: sellerId, valueName: "sellerId" });

  const DefaultrecommendedProducts =
    await DefaultRecommendedSellerProductAmount.findOne({
      sellerId,
      category,
      subCategory,
    })
      .collation({ locale: "en", strength: 2 })
      .lean();
  if (!DefaultrecommendedProducts) {
    return { amountOfProducts: 0 };
  }
  return DefaultrecommendedProducts;
};
