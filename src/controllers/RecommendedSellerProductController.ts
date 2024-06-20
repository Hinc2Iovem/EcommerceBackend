import { RequestHandler } from "express";
import {
  addToRecommendedProductsService,
  getRecommendedSellerProductsService,
  getSingleRecommendedSellerProductService,
  removeRecommendedProductService,
  updateRecommendedProductsService,
} from "../services/RecommendedSellerProductService";

export interface RecommendedProductsParams {
  productId: string;
}

// @route GET http://localhost:3500/recommendedProducts/products/:productId
// @access Public
export const getRecommendedSellerProducts: RequestHandler<
  RecommendedProductsParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const product = await getRecommendedSellerProductsService({
      productId: req.params.productId,
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
  recommendedProductId: string;
  productId: string;
}

// @route GET http://localhost:3500/recommendedProducts/:recommendedProductId/products/:productId
// @access Public
export const getSingleRecommendedSellerProduct: RequestHandler<
  SingleRecommendedProductsParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const product = await getSingleRecommendedSellerProductService({
      recommendedProductId: req.params.recommendedProductId,
      productId: req.params.productId,
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

type RecommendedProductsBody = {
  recommendedProductId: string;
};

// @route POST http://localhost:3500/recommendedProducts/products/:productId
// @access PRIVATE
export const addToRecommendedProducts: RequestHandler<
  RecommendedProductsParams,
  unknown,
  RecommendedProductsBody,
  unknown
> = async (req, res, next) => {
  try {
    const product = await addToRecommendedProductsService({
      productId: req.params.productId,
      recommendedProductId: req.body.recommendedProductId,
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

export interface RecommendedProductsUpdateParams {
  productId: string;
}

type RecommendedProductsUpdateBody = {
  newRecommendedProductId: string;
  prevRecommendedProductId: string;
};

// @route PATCH http://localhost:3500/recommendedProducts/products/:productId
// @access PRIVATE
export const updateRecommendedProducts: RequestHandler<
  RecommendedProductsUpdateParams,
  unknown,
  RecommendedProductsUpdateBody,
  unknown
> = async (req, res, next) => {
  try {
    const product = await updateRecommendedProductsService({
      productId: req.params.productId,
      newRecommendedProductId: req.body.newRecommendedProductId,
      prevRecommendedProductId: req.body.prevRecommendedProductId,
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

export interface RecommendedProductsDeleteParams {
  productId: string;
  recommendedProductId: string;
}

// @route DELETE http://localhost:3500/recommendedProducts/:recommendedProductId/products/:productId
// @access PRIVATE
export const removeRecommendedProduct: RequestHandler<
  RecommendedProductsDeleteParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const product = await removeRecommendedProductService({
      productId: req.params.productId,
      recommendedProductId: req.params.recommendedProductId,
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
