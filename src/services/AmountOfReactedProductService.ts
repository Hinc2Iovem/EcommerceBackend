import AmountOfReactedProduct from "../models/AmountOfReactedProduct";
import { validateMongoId } from "../utils/validateMongoId";

export type getAmountOfReactedProductTypes = {
  productId: string;
};

export const getAmountOfReactedProductService = async ({
  productId,
}: getAmountOfReactedProductTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });

  const existingAmountOfReactedProducts = await AmountOfReactedProduct.findOne({
    productId,
  }).lean();
  if (!existingAmountOfReactedProducts) {
    return { amountOfReactions: 0 };
  }

  return existingAmountOfReactedProducts;
};
