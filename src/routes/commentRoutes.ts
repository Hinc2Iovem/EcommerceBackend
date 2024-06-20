import express from "express";
import {
  createComment,
  deleteComment,
  getCommentsByProductId,
  updateComment,
  updateLikesComment,
} from "../controllers/CommentController";
import { verifyJWT } from "../middleware/verifyJWT";

// Default route === /comments

export const commentRouter = express.Router();

commentRouter
  .route("/products/:productId/users/:userId")
  .post(verifyJWT, createComment);

commentRouter.route("/products/:productId").get(getCommentsByProductId);
commentRouter
  .route("/:commentId")
  .patch(verifyJWT, updateComment)
  .delete(verifyJWT, deleteComment);
commentRouter
  .route("/:commentId/users/:userId")
  .patch(verifyJWT, updateLikesComment);
