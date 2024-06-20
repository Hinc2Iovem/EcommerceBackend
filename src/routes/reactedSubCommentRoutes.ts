import express from "express";
import { getReactedSubCommentByUserIdCommentId } from "../controllers/ReactedSubCommentController";

// Default route === /reactedSubComments

export const reactedSubCommentRouter = express.Router();

reactedSubCommentRouter
  .route("/:subCommentId/users/:userId")
  .get(getReactedSubCommentByUserIdCommentId);
