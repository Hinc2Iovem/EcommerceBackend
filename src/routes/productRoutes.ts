import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getAllProductsByUserId,
  getProductByProductId,
  updateProduct,
  updateProductRanking,
} from "../controllers/ProductController";
import { verifySeller } from "../middleware/verifySeller";
import { verifyJWT } from "../middleware/verifyJWT";

// Default route === /products

export const productRouter = express.Router();

productRouter
  .route("/users/:userId")
  .post(verifySeller, createProduct)
  .get(getAllProductsByUserId);

productRouter.route("/").get(getAllProducts);
productRouter
  .route("/:productId")
  .patch(verifySeller, updateProduct)
  .get(getProductByProductId);

productRouter
  .route("/:productId/users/:userId")
  .patch(verifyJWT, updateProductRanking)
  .delete(verifySeller, deleteProduct);
