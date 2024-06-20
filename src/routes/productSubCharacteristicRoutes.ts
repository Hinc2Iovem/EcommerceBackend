import express from "express";
import {
  createProductSubCharacteristics,
  deleteProductSubCharacteristics,
  getAllProductSubCharacteristics,
  updateProductSubCharacteristics,
} from "../controllers/ProductSubCharacteristicController";
import { verifySeller } from "../middleware/verifySeller";

// Default route === /productSubCharacteristics

export const productSubCharacteristicRouter = express.Router();

productSubCharacteristicRouter
  .route("/productCharacteristics/:productCharacteristicId")
  .get(getAllProductSubCharacteristics)
  .post(verifySeller, createProductSubCharacteristics);

productSubCharacteristicRouter
  .route("/:productSubCharacteristicId")
  .patch(verifySeller, updateProductSubCharacteristics)
  .delete(verifySeller, deleteProductSubCharacteristics);
