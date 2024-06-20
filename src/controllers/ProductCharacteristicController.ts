import { RequestHandler } from "express";
import {
  createProductCharacteristicsService,
  deleteProductCharacteristicsService,
  getAllProductCharacteristicsService,
  updateProductCharacteristicsService,
} from "../services/ProductCharacteristicService";

export interface ProductCharacteristicParams {
  productId: string;
}

export interface ProductCharacteristicBody {
  title: string;
}

// @route GET http://localhost:3500/productCharacteristics/products/:productId
// @access Public
export const getAllProductCharacteristics: RequestHandler<
  ProductCharacteristicParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const product = await getAllProductCharacteristicsService({
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

// @route POST http://localhost:3500/productCharacteristics/products/:productId
// @access Private
export const createProductCharacteristics: RequestHandler<
  ProductCharacteristicParams,
  unknown,
  ProductCharacteristicBody,
  unknown
> = async (req, res, next) => {
  try {
    const product = await createProductCharacteristicsService({
      productId: req.params.productId,
      title: req.body.title,
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

export interface ProductCharacteristicUpdateDeleteParams {
  productCharacteristicId: string;
}

// @route PATCH http://localhost:3500/productCharacteristics/:productCharacteristicId
// @access Private
export const updateProductCharacteristics: RequestHandler<
  ProductCharacteristicUpdateDeleteParams,
  unknown,
  ProductCharacteristicBody,
  unknown
> = async (req, res, next) => {
  try {
    const product = await updateProductCharacteristicsService({
      productCharacteristicId: req.params.productCharacteristicId,
      title: req.body.title,
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

// @route DELETE http://localhost:3500/productCharacteristics/:productCharacteristicId
// @access Private
export const deleteProductCharacteristics: RequestHandler<
  ProductCharacteristicUpdateDeleteParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const product = await deleteProductCharacteristicsService({
      productCharacteristicId: req.params.productCharacteristicId,
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
