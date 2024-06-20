import express from "express";
import { getReactedCommentByUserIdCommentId } from "../controllers/ReactedCommentController";

// Default route === /reactedComments

export const reactedCommentRouter = express.Router();

reactedCommentRouter
  .route("/:commentId/users/:userId")
  .get(getReactedCommentByUserIdCommentId);
