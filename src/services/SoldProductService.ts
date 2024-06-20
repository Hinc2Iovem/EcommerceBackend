import Product from "../models/Product";
import SoldProduct from "../models/SoldProduct";
import { ProductTypes } from "../types/Product";
import { validateMongoId } from "../utils/validateMongoId";

type GetAllSoldProductsByUserIdServiceTypes = {
  userId: string;
};

type AllProductsTypes = {
  quantity: number;
} & ProductTypes;

export const getAllSoldProductsByUserIdService = async ({
  userId,
}: GetAllSoldProductsByUserIdServiceTypes) => {
  validateMongoId({ value: userId, valueName: "userId" });

  const soldProducts = await SoldProduct.find({ userId });

  if (!soldProducts) {
    return [];
  }

  let allProducts: AllProductsTypes[] = [];
  for (const s of soldProducts) {
    const existingProduct = (await Product.findById(
      s.productId
    ).lean()) as ProductTypes;
    if (!existingProduct) {
      return null;
    }
    const newProduct = { ...existingProduct, quantity: s.quantity as number };
    allProducts.push(newProduct);
  }

  return allProducts;
};
