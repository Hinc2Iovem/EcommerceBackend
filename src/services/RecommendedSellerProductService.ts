import createHttpError from "http-errors";
import Product from "../models/Product";
import RecommendedSellerProduct from "../models/RecommendedSellerProduct";
import RecommendedSellerProductAmount from "../models/RecommendedSellerProductAmount";
import { validateMongoId } from "../utils/validateMongoId";
import { valueExists } from "../utils/valueExists";

type RecommendedProductsTypes = {
  productId: string;
};

export const getRecommendedSellerProductsService = async ({
  productId,
}: RecommendedProductsTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });

  const recommendedProducts = await RecommendedSellerProduct.find({
    productId,
  }).lean();
  if (!recommendedProducts || !recommendedProducts.length) {
    // throw createHttpError(404, "No recommended products");
    return [];
  }
  return recommendedProducts;
};

type SingleRecommendedProductsTypes = {
  recommendedProductId: string;
  productId: string;
};

export const getSingleRecommendedSellerProductService = async ({
  recommendedProductId,
  productId,
}: SingleRecommendedProductsTypes) => {
  validateMongoId({
    value: recommendedProductId,
    valueName: "recommendedProductId",
  });
  validateMongoId({
    value: productId,
    valueName: "productId",
  });

  const recommendedProduct = await RecommendedSellerProduct.findOne({
    productId,
    recommendedProductId,
  }).lean();
  if (!recommendedProduct) {
    return null;
  }
  return recommendedProduct;
};

type AddRecommendedProductTypes = {
  productId: string;
  recommendedProductId: string;
};

export const addToRecommendedProductsService = async ({
  productId,
  recommendedProductId,
}: AddRecommendedProductTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });
  validateMongoId({
    value: recommendedProductId,
    valueName: "recommendedProductId",
  });

  const existingProduct = await Product.findById(productId).lean();
  valueExists({ value: existingProduct, valueName: "Product" });

  const existingRecommendedProduct = await Product.findById(
    recommendedProductId
  ).lean();
  valueExists({
    value: existingRecommendedProduct,
    valueName: "RecommendedProduct",
  });

  const recommendedSellerProductAmount =
    await RecommendedSellerProductAmount.findOne({
      productId,
    }).exec();
  if (!recommendedSellerProductAmount) {
    await RecommendedSellerProductAmount.create({
      productId,
      amountOfProducts: 1,
    });
    return await RecommendedSellerProduct.create({
      productId,
      recommendedProductId,
    });
  } else {
    if (
      recommendedSellerProductAmount.amountOfProducts &&
      recommendedSellerProductAmount.amountOfProducts < 10
    ) {
      recommendedSellerProductAmount.amountOfProducts += 1;
      recommendedSellerProductAmount.save();
      return await RecommendedSellerProduct.create({
        productId,
        recommendedProductId,
      });
    } else {
      throw createHttpError(400, "Only 10 recommended products are allowed.");
    }
  }
};

type RecommendedProductsUpdate = {
  newRecommendedProductId: string;
  prevRecommendedProductId: string;
  productId: string;
};

export const updateRecommendedProductsService = async ({
  productId,
  prevRecommendedProductId,
  newRecommendedProductId,
}: RecommendedProductsUpdate) => {
  validateMongoId({ value: productId, valueName: "productId" });
  validateMongoId({
    value: prevRecommendedProductId,
    valueName: "prevRecommendedProductId",
  });
  validateMongoId({
    value: newRecommendedProductId,
    valueName: "newRecommendedProductId",
  });

  const existingProduct = await Product.findById(productId).lean();
  valueExists({ value: existingProduct, valueName: "Product" });

  const existingPrevProduct = await RecommendedSellerProduct.findById(
    prevRecommendedProductId
  ).lean();
  valueExists({ value: existingPrevProduct, valueName: "PrevProduct" });

  const existingNewProduct = await Product.findById(
    newRecommendedProductId
  ).lean();
  valueExists({ value: existingNewProduct, valueName: "NewProduct" });

  const isProductHasRecommendations = await RecommendedSellerProduct.findOne({
    productId,
  }).lean();
  if (!isProductHasRecommendations) {
    throw createHttpError(400, "Product doesn't have any recommendations");
  }

  const productAlreadyRecommended = await RecommendedSellerProduct.findOne({
    recommendedProductId: newRecommendedProductId,
    productId,
  }).lean();
  if (productAlreadyRecommended) {
    throw createHttpError(400, "Product is already recommended");
  }

  const currentRecommendations = await RecommendedSellerProduct.findOne({
    productId,
    recommendedProductId: existingPrevProduct?.recommendedProductId,
  });
  valueExists({
    value: currentRecommendations,
    valueName: "currentRecommendations",
  });

  const updatedRecommendation = await RecommendedSellerProduct.create({
    productId,
    recommendedProductId: newRecommendedProductId,
  });
  await currentRecommendations?.deleteOne();
  return updatedRecommendation;
};

type RecommendedProductsDeleteServiceTypes = {
  recommendedProductId: string;
  productId: string;
};

export const removeRecommendedProductService = async ({
  recommendedProductId,
  productId,
}: RecommendedProductsDeleteServiceTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });
  validateMongoId({
    value: recommendedProductId,
    valueName: "recommendedProductId",
  });

  const recommendedProductAmount = await RecommendedSellerProductAmount.findOne(
    { productId }
  ).exec();
  valueExists({
    value: recommendedProductAmount,
    valueName: "RecommendedProductAmount",
  });

  if (recommendedProductAmount?.amountOfProducts) {
    recommendedProductAmount.amountOfProducts -= 1;
    await recommendedProductAmount!.save();
    if (recommendedProductAmount.amountOfProducts < 1) {
      await recommendedProductAmount.deleteOne();
    }
  }

  await RecommendedSellerProduct.findOneAndDelete({
    recommendedProductId,
    productId,
  });

  return `Item with id ${recommendedProductId} was removed`;
};
