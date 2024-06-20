import express from "express";
import {
  createSubComment,
  deleteSubComment,
  getSubCommentsByCommentId,
  updateSubComment,
  updateLikesSubComment,
} from "../controllers/SubCommentController";
import { verifyJWT } from "../middleware/verifyJWT";

// Default route === /subComments

export const subCommentRouter = express.Router();

subCommentRouter
  .route("/comments/:commentId/users/:userId")
  .post(verifyJWT, createSubComment);

subCommentRouter.route("/comments/:commentId").get(getSubCommentsByCommentId);
subCommentRouter
  .route("/:subCommentId")
  .patch(verifyJWT, updateSubComment)
  .delete(verifyJWT, deleteSubComment);

subCommentRouter
  .route("/:subCommentId/users/:userId")
  .patch(verifyJWT, updateLikesSubComment);
