import createHttpError from "http-errors";
import Product from "../models/Product";
import RecommendedSellerProduct from "../models/RecommendedSellerProduct";
import RecommendedSellerProductAmount from "../models/RecommendedSellerProductAmount";
import User from "../models/User";
import { validateMongoId } from "../utils/validateMongoId";
import { valueExists } from "../utils/valueExists";
import DefaultRecommendedSellerProduct from "../models/DefaultRecommendedSellerProduct";
import DefaultRecommendedSellerProductAmount from "../models/DefaultRecommendedSellerProductAmount";

type DefaultRecommendedProductsTypes = {
  sellerId: string;
  category: string;
  subCategory: string;
};

export const getDefaultRecommendedProductsSellerService = async ({
  sellerId,
  category,
  subCategory,
}: DefaultRecommendedProductsTypes) => {
  validateMongoId({ value: sellerId, valueName: "sellerId" });

  const recommendedProducts = await DefaultRecommendedSellerProduct.find({
    sellerId,
    category,
    subCategory,
  })
    .collation({ locale: "en", strength: 2 })
    .lean();
  if (!recommendedProducts || !recommendedProducts.length) {
    return [];
    // throw createHttpError(404, "No default recommended products");
  }
  return recommendedProducts;
};

type DefaultSingleRecommendedProductTypes = {
  productId: string;
  category: string;
  subCategory: string;
};

export const getDefaultRecommendedSingleProductSellerService = async ({
  productId,
  category,
  subCategory,
}: DefaultSingleRecommendedProductTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });

  const recommendedProduct = await DefaultRecommendedSellerProduct.findOne({
    productId,
    category,
    subCategory,
  })
    .collation({ locale: "en", strength: 2 })
    .lean();
  if (!recommendedProduct) {
    return null;
    // throw createHttpError(404, "No default recommended product");
  }
  return recommendedProduct;
};

type MakeDefaultRecommendedProductsTypes = {
  sellerId: string;
  category: string;
  subCategory: string;
  productId: string;
};

export const makeDefaultRecommendedProductsService = async ({
  sellerId,
  category,
  subCategory,
  productId,
}: MakeDefaultRecommendedProductsTypes) => {
  validateMongoId({ value: sellerId, valueName: "sellerId" });
  validateMongoId({ value: productId, valueName: "productId" });

  const existingUser = await User.findById(sellerId).select("-password").lean();
  valueExists({ value: existingUser, valueName: "User" });

  const defaultRecommendedSellerProductAmount =
    await DefaultRecommendedSellerProductAmount.findOne({
      category,
      sellerId,
      subCategory,
    })
      .collation({ locale: "en", strength: 2 })
      .exec();

  if (!defaultRecommendedSellerProductAmount) {
    await DefaultRecommendedSellerProductAmount.create({
      amountOfProducts: 1,
      category,
      sellerId,
      subCategory,
    });
    return await DefaultRecommendedSellerProduct.create({
      category,
      subCategory,
      sellerId,
      productId,
    });
  } else {
    if (
      (defaultRecommendedSellerProductAmount!.amountOfProducts as number) < 10
    ) {
      (defaultRecommendedSellerProductAmount!.amountOfProducts as number) += 1;
      defaultRecommendedSellerProductAmount.save();
      return await DefaultRecommendedSellerProduct.create({
        category,
        subCategory,
        sellerId,
        productId,
      });
    } else {
      throw createHttpError(400, "Only 10 recommended products is allowed.");
    }
  }
};

type DefaultRecommendedProductsUpdate = {
  newDefaultRecommendedProductId: string;
  prevDefaultRecommendedProductId: string;
  sellerId: string;
};

export const updateDefaultRecommendedProductsService = async ({
  prevDefaultRecommendedProductId,
  newDefaultRecommendedProductId,
  sellerId,
}: DefaultRecommendedProductsUpdate) => {
  validateMongoId({
    value: prevDefaultRecommendedProductId,
    valueName: "prevDefaultRecommendedProductId",
  });
  validateMongoId({
    value: newDefaultRecommendedProductId,
    valueName: "newDefaultRecommendedProductId",
  });

  const existingPrevProduct = await DefaultRecommendedSellerProduct.findById(
    prevDefaultRecommendedProductId
  ).exec();
  valueExists({ value: existingPrevProduct, valueName: "PrevProduct" });

  const existingNewProduct = await Product.findById(
    newDefaultRecommendedProductId
  ).lean();
  valueExists({ value: existingNewProduct, valueName: "NewProduct" });

  if (
    !existingPrevProduct!.sellerId?.equals(sellerId) &&
    !existingNewProduct!.userId?.equals(sellerId)
  ) {
    throw createHttpError(400, "You can't have someone else's product");
  }

  if (
    existingNewProduct?.category.trim().toLocaleLowerCase() !==
      existingPrevProduct?.category.trim().toLocaleLowerCase() &&
    existingNewProduct?.subCategory.trim().toLocaleLowerCase() !==
      existingPrevProduct?.subCategory.trim().toLocaleLowerCase()
  ) {
    throw createHttpError(
      400,
      "Products should be of the same category and subCategory"
    );
  }

  const productAlreadyDefaultRecommended =
    await DefaultRecommendedSellerProduct.findOne({
      productId: newDefaultRecommendedProductId,
    }).lean();
  if (productAlreadyDefaultRecommended) {
    throw createHttpError(400, "Product is already recommended");
  }

  await existingPrevProduct!.deleteOne();

  const updatedRecommendation = await DefaultRecommendedSellerProduct.create({
    productId: newDefaultRecommendedProductId,
    category: existingNewProduct?.category,
    subCategory: existingNewProduct?.subCategory,
    sellerId,
  });

  return updatedRecommendation;
};

type DefaultRecommendedProductsDeleteServiceTypes = {
  productId: string;
  sellerId: string;
  category: string;
  subCategory: string;
};

export const removeDefaultRecommendedProductService = async ({
  productId,
  sellerId,
  category,
  subCategory,
}: DefaultRecommendedProductsDeleteServiceTypes) => {
  validateMongoId({
    value: productId,
    valueName: "productId",
  });

  const recommendedProductAmount =
    await DefaultRecommendedSellerProductAmount.findOne({
      category,
      subCategory,
      sellerId,
    }).exec();
  valueExists({
    value: recommendedProductAmount,
    valueName: "RecommendedProductAmount",
  });

  if (recommendedProductAmount?.amountOfProducts) {
    recommendedProductAmount.amountOfProducts -= 1;
    recommendedProductAmount!.save();
  }

  await DefaultRecommendedSellerProduct.findOneAndDelete({
    productId,
    category,
    subCategory,
  });

  return `Item with id ${productId} was removed`;
};
