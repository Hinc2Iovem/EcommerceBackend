import { RequestHandler } from "express";
import {
  createProductSubCharacteristicsService,
  deleteProductSubCharacteristicsService,
  getAllProductSubCharacteristicsService,
  updateProductSubCharacteristicsService,
} from "../services/ProductSubCharacteristicService";

export interface ProductSubCharacteristicParams {
  productCharacteristicId: string;
}

export interface ProductSubCharacteristicBody {
  subTitle: string;
  text: string;
}

// @route GET http://localhost:3500/productSubCharacteristics/productCharacteristics/:productCharacteristicId
// @access Public
export const getAllProductSubCharacteristics: RequestHandler<
  ProductSubCharacteristicParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const product = await getAllProductSubCharacteristicsService({
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

// @route POST http://localhost:3500/productSubCharacteristics/productCharacteristics/:productCharacteristicId
// @access Private
export const createProductSubCharacteristics: RequestHandler<
  ProductSubCharacteristicParams,
  unknown,
  ProductSubCharacteristicBody,
  unknown
> = async (req, res, next) => {
  try {
    const product = await createProductSubCharacteristicsService({
      productCharacteristicId: req.params.productCharacteristicId,
      text: req.body.text,
      subTitle: req.body.subTitle,
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

export interface ProductSubCharacteristicUpdateDeleteParams {
  productSubCharacteristicId: string;
}

// @route PATCH http://localhost:3500/productSubCharacteristics/:productSubCharacteristicId
// @access Private
export const updateProductSubCharacteristics: RequestHandler<
  ProductSubCharacteristicUpdateDeleteParams,
  unknown,
  ProductSubCharacteristicBody,
  unknown
> = async (req, res, next) => {
  try {
    const product = await updateProductSubCharacteristicsService({
      productSubCharacteristicId: req.params.productSubCharacteristicId,
      text: req.body.text,
      subTitle: req.body.subTitle,
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

// @route DELETE http://localhost:3500/productSubCharacteristics/:productSubCharacteristicId
// @access Private
export const deleteProductSubCharacteristics: RequestHandler<
  ProductSubCharacteristicUpdateDeleteParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const product = await deleteProductSubCharacteristicsService({
      productSubCharacteristicId: req.params.productSubCharacteristicId,
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
