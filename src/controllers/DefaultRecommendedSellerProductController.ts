import { RequestHandler } from "express";
import {
  getDefaultRecommendedProductsSellerService,
  getDefaultRecommendedSingleProductSellerService,
  makeDefaultRecommendedProductsService,
  removeDefaultRecommendedProductService,
  updateDefaultRecommendedProductsService,
} from "../services/DefaultRecommendedSellerProductService";

export interface RecommendedProductsParams {
  sellerId: string;
}

export interface RecommendedProductsBody {
  category: string;
  subCategory: string;
}

// @route GET http://localhost:3500/defaultRecommendedProducts/sellers/:sellerId
// @access Public
export const getDefaultRecommendedProductsSellerProducts: RequestHandler<
  RecommendedProductsParams,
  unknown,
  unknown,
  RecommendedProductsBody
> = async (req, res, next) => {
  try {
    const product = await getDefaultRecommendedProductsSellerService({
      sellerId: req.params.sellerId,
      category: req.query.category,
      subCategory: req.query.subCategory,
    });
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

export interface SingleRecommendedProductsParams {
  productId: string;
}

// @route GET http://localhost:3500/defaultRecommendedProducts/products/:productId
// @access Public
export const getDefaultRecommendedSingleProductSeller: RequestHandler<
  SingleRecommendedProductsParams,
  unknown,
  unknown,
  RecommendedProductsBody
> = async (req, res, next) => {
  try {
    const product = await getDefaultRecommendedSingleProductSellerService({
      productId: req.params.productId,
      category: req.query.category,
      subCategory: req.query.subCategory,
    });
    if (product) {
      return res.status(200).json(product);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

export interface MakeRecommendedProductsBody {
  category: string;
  subCategory: string;
  productId: string;
}

// @route PUT http://localhost:3500/defaultRecommendedProducts/sellers/:sellerId
// @access Private
export const makeDefaultRecommendedProducts: RequestHandler<
  RecommendedProductsParams,
  unknown,
  MakeRecommendedProductsBody,
  unknown
> = async (req, res, next) => {
  try {
    const product = await makeDefaultRecommendedProductsService({
      sellerId: req.params.sellerId,
      productId: req.body.productId,
      category: req.body.category,
      subCategory: req.body.subCategory,
    });
    if (product) {
      return res.status(201).json(product);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

type RecommendedProductsUpdateBody = {
  newDefaultRecommendedProductId: string;
  prevDefaultRecommendedProductId: string;
};

// @route PATCH http://localhost:3500/defaultRecommendedProducts/sellers/:sellerId
// @access PRIVATE
export const updateDefaultRecommendedProducts: RequestHandler<
  RecommendedProductsParams,
  unknown,
  RecommendedProductsUpdateBody,
  unknown
> = async (req, res, next) => {
  try {
    const product = await updateDefaultRecommendedProductsService({
      sellerId: req.params.sellerId,
      newDefaultRecommendedProductId: req.body.newDefaultRecommendedProductId,
      prevDefaultRecommendedProductId: req.body.prevDefaultRecommendedProductId,
    });
    if (product) {
      return res.status(201).json(product);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

type RemoveDefaultRecommendedProductTypes = {
  productId: string;
  sellerId: string;
};

type RemoveDefaultRecommendedProductBodyTypes = {
  category: string;
  subCategory: string;
};

// @route DELETE http://localhost:3500/defaultRecommendedProducts/products/:productId/sellers/:sellerId
// @access PRIVATE
export const removeDefaultRecommendedProduct: RequestHandler<
  RemoveDefaultRecommendedProductTypes,
  unknown,
  unknown,
  RemoveDefaultRecommendedProductBodyTypes
> = async (req, res, next) => {
  try {
    const product = await removeDefaultRecommendedProductService({
      productId: req.params.productId,
      sellerId: req.params.sellerId,
      category: req.query.category,
      subCategory: req.query.subCategory,
    });
    if (product) {
      return res.status(201).json(product);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};
