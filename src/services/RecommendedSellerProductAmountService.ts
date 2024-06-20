import RecommendedSellerProductAmount from "../models/RecommendedSellerProductAmount";
import { validateMongoId } from "../utils/validateMongoId";

type RecommendedProductsTypes = {
  productId: string;
};

export const getRecommendedSellerProductsAmountService = async ({
  productId,
}: RecommendedProductsTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });

  const recommendedProducts = await RecommendedSellerProductAmount.findOne({
    productId,
  }).lean();
  if (!recommendedProducts) {
    return { amountOfProducts: 0 };
  }
  return recommendedProducts;
};
