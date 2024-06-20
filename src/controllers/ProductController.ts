import { RequestHandler } from "express";
import {
  createProductService,
  deleteProductService,
  getAllProductsByUserIdService,
  getAllProductsService,
  getProductByProductIdService,
  updateProductRankingService,
  updateProductService,
} from "../services/ProductService";

export interface ProductBody {
  title?: string;
  description?: string;
  imgUrls?: string[];
  category?: string;
  subCategory?: string;
  brand?: string;
  price?: number;
  frontImg?: string;
}

// @route GET http://localhost:3500/products
// @access Public
export const getAllProducts: RequestHandler = async (req, res, next) => {
  try {
    const product = await getAllProductsService();
    if (product) {
      return res.status(201).json(product);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

interface GetProductByProductIdParams {
  productId?: string;
}

// @route GET http://localhost:3500/products/:productId
// @access Public
export const getProductByProductId: RequestHandler<
  GetProductByProductIdParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const product = await getProductByProductIdService({
      productId: req.params.productId,
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

interface GetAllProductsByUserIdParams {
  userId: string;
}

// @route GET http://localhost:3500/products/users/:userId
// @access Public
export const getAllProductsByUserId: RequestHandler<
  GetAllProductsByUserIdParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const product = await getAllProductsByUserIdService({
      userId: req.params.userId,
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

interface CreateProductParams {
  userId: string;
}

// @route POST http://localhost:3500/products/users/:userId
// @access Private
export const createProduct: RequestHandler<
  CreateProductParams,
  unknown,
  ProductBody,
  unknown
> = async (req, res, next) => {
  try {
    const product = await createProductService({
      product: req.body,
      userId: req.params.userId,
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

interface UpdateProductParams {
  productId: string;
}

// @route PATCH http:///localhost:3500/products/:productId
// @access Private
export const updateProduct: RequestHandler<
  UpdateProductParams,
  unknown,
  ProductBody,
  unknown
> = async (req, res, next) => {
  try {
    const product = await updateProductService({
      product: req.body,
      productId: req.params.productId,
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

type UpdateProductRankingParamsTypes = {
  productId: string;
  userId: string;
};
type UpdateProductRankingBodyTypes = {
  rating: number;
};

// @route PATCH http:///localhost:3500/products/:productId/users/:userId
// @access Private
export const updateProductRanking: RequestHandler<
  UpdateProductRankingParamsTypes,
  unknown,
  UpdateProductRankingBodyTypes,
  unknown
> = async (req, res, next) => {
  try {
    const product = await updateProductRankingService({
      productId: req.params.productId,
      rating: req.body.rating,
      userId: req.params.userId,
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

interface DeleteProductParams {
  productId: string;
  userId: string;
}

// @route PATCH http:////localhost:3500/products/:productId/users/:userId
// @access Private
export const deleteProduct: RequestHandler<
  DeleteProductParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const product = await deleteProductService({
      productId: req.params.productId,
      userId: req.params.userId,
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
