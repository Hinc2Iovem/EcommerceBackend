import createHttpError from "http-errors";
import { ProductBody } from "../controllers/ProductController";
import Product from "../models/Product";
import ProductCharacteristic from "../models/ProductCharacteristic";
import ProductSubCharacteristic from "../models/ProductSubCharacteristic";
import ReactedProduct from "../models/ReactedProduct";
import User from "../models/User";
import { validateMongoId } from "../utils/validateMongoId";
import { valueExists } from "../utils/valueExists";

export const getAllProductsService = async () => {
  const products = await Product.find().lean();
  if (!products || !products.length) {
    return [];
  }
  return products;
};

type GetProductsByProductIdServiceTypes = {
  productId: string | undefined;
};

export const getProductByProductIdService = async ({
  productId,
}: GetProductsByProductIdServiceTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });

  const existingProduct = await Product.findById(productId);
  if (!existingProduct) {
    return null;
  }

  return existingProduct;
};

type GetAllProductsByUserIdServiceTypes = {
  userId: string | undefined;
};

export const getAllProductsByUserIdService = async ({
  userId,
}: GetAllProductsByUserIdServiceTypes) => {
  validateMongoId({ value: userId, valueName: "userId" });

  const existingUser = await User.findById(userId);
  valueExists({ value: existingUser, valueName: "User" });

  const products = await Product.find({ userId }).lean();
  if (!products) {
    return [];
  }
  return products;
};

type CreateProductServiceTypes = {
  product: ProductBody;
  userId: string | undefined;
};

export const createProductService = async ({
  product,
  userId,
}: CreateProductServiceTypes) => {
  validateMongoId({ value: userId, valueName: "userId" });

  const {
    brand,
    category,
    description,
    frontImg,
    imgUrls,
    price,
    title,
    subCategory,
  } = product;

  if (
    !brand ||
    !category ||
    !description ||
    !frontImg ||
    !imgUrls ||
    !price ||
    !title ||
    !subCategory
  ) {
    throw createHttpError(
      400,
      "Body should include brand, category, description, frontImg, imgUrls, price, subCategory and title"
    );
  }
  const existingUser = await User.findById(userId).select("-password");
  valueExists({ value: existingUser, valueName: "User" });

  const productObject = { ...product, userId };
  const newProduct = await Product.create(productObject);

  return newProduct;
};

type UpdateProductServiceTypes = {
  product: ProductBody;
  productId: string | undefined;
};

export const updateProductService = async ({
  product,
  productId,
}: UpdateProductServiceTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });

  const {
    brand,
    category,
    description,
    frontImg,
    imgUrls,
    price,
    title,
    subCategory,
  } = product;

  const existingProduct = await Product.findById(productId);
  valueExists({ value: existingProduct, valueName: "Product" });

  if (brand?.trim()) {
    existingProduct!.brand = brand;
  }
  if (category) {
    existingProduct!.category = category;
  }
  if (subCategory) {
    existingProduct!.subCategory = subCategory;
  }
  if (description) {
    existingProduct!.description = description;
  }
  if (frontImg) {
    existingProduct!.frontImg = frontImg;
  }
  if (imgUrls) {
    existingProduct!.imgUrls = imgUrls;
  }
  if (price) {
    existingProduct!.price = price;
  }
  if (title) {
    existingProduct!.title = title;
  }

  const updatedProduct = await existingProduct!.save();

  return updatedProduct;
};

type UpdateProductRankingServiceTypes = {
  productId: string;
  userId: string;
  rating: number;
};

export const updateProductRankingService = async ({
  productId,
  userId,
  rating,
}: UpdateProductRankingServiceTypes) => {
  rating = +rating;
  if (rating < 1 || rating > 5) {
    throw createHttpError(
      400,
      "Rating should be no less than 1 and no more than 5"
    );
  }
  validateMongoId({ value: productId, valueName: "productId" });
  validateMongoId({ value: userId, valueName: "userId" });

  const existingProduct = await Product.findById(productId);
  valueExists({ value: existingProduct, valueName: "Product" });
  const existingUser = await User.findById(userId).lean();
  valueExists({ value: existingUser, valueName: "User" });

  let existingReactedProduct = await ReactedProduct.findOne({
    userId,
    productId,
  }).exec();

  const allProductRatings = await ReactedProduct.find({
    productId,
  }).lean();

  let allProductRatingsNumber = allProductRatings.reduce((acc, next) => {
    return acc + (next.rating ? next.rating : 0);
  }, 0);

  const allProductRatingsLength = allProductRatings.length;
  if (existingReactedProduct?.rating) {
    allProductRatingsNumber -= existingReactedProduct.rating;
  }

  if (existingReactedProduct) {
    existingReactedProduct.rating = rating;
  } else {
    existingProduct!.amountOfRatings += 1;
    existingReactedProduct = new ReactedProduct({
      userId,
      productId,
      rating,
    });
  }

  allProductRatingsNumber += rating;

  existingProduct!.rating = allProductRatingsNumber / allProductRatingsLength;
  await Promise.all([existingProduct!.save(), existingReactedProduct!.save()]);

  return existingProduct!.rating;
};

type DeleteProductServiceTypes = {
  productId: string | undefined;
  userId: string | undefined;
};

export const deleteProductService = async ({
  userId,
  productId,
}: DeleteProductServiceTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });
  validateMongoId({ value: userId, valueName: "userId" });

  const existingProduct = await Product.findById(productId);
  valueExists({ value: existingProduct, valueName: "Product" });

  const existingUser = await User.findById(userId).select("-password");
  valueExists({ value: existingUser, valueName: "User" });

  if (!existingProduct!.userId?.equals(userId)) {
    throw createHttpError(409, "You can't remove someone else's product");
  }
  const existingCharacteristic = await ProductCharacteristic.findOne({
    productId,
  });
  if (existingCharacteristic) {
    await ProductSubCharacteristic.deleteMany({
      productCharacteristicId: existingCharacteristic._id,
    });
  }
  await ProductCharacteristic.deleteMany({ productId });
  await existingProduct!.deleteOne();

  return `Product with id ${productId} was deleted`;
};
