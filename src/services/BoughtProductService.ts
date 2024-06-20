import BoughtProduct from "../models/BoughtProduct";
import Product from "../models/Product";
import { ProductTypes } from "../types/Product";
import { validateMongoId } from "../utils/validateMongoId";
import { valueExists } from "../utils/valueExists";

type GetAllBoughtProductsByUserIdServiceTypes = {
  userId: string;
};

type AllProductsTypes = {
  quantity: number;
} & ProductTypes;

export const getAllBoughtProductsByUserIdService = async ({
  userId,
}: GetAllBoughtProductsByUserIdServiceTypes) => {
  validateMongoId({ value: userId, valueName: "userId" });

  const boughtProducts = await BoughtProduct.find({ userId });

  if (!boughtProducts) {
    return [];
  }

  let allProducts: AllProductsTypes[] = [];
  for (const b of boughtProducts) {
    const existingProduct = (await Product.findById(
      b.productId
    ).lean()) as ProductTypes;
    // valueExists({ value: existingProduct, valueName: "Product" });
    if (!existingProduct) {
      return null;
    }
    const newProduct = { ...existingProduct, quantity: b.quantity as number };
    allProducts.push(newProduct);
  }
  return allProducts;
};
