import express from "express";
import {
  createProductCharacteristics,
  deleteProductCharacteristics,
  getAllProductCharacteristics,
  updateProductCharacteristics,
} from "../controllers/ProductCharacteristicController";
import { verifySeller } from "../middleware/verifySeller";

// Default route === /productCharacteristics

export const productCharacteristicRouter = express.Router();

productCharacteristicRouter
  .route("/products/:productId")
  .get(getAllProductCharacteristics)
  .post(verifySeller, createProductCharacteristics);

productCharacteristicRouter
  .route("/:productCharacteristicId")
  .patch(verifySeller, updateProductCharacteristics)
  .delete(verifySeller, deleteProductCharacteristics);
