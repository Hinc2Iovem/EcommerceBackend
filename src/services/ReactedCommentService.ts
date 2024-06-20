import createHttpError from "http-errors";
import ReactedComment from "../models/ReactedComment";
import { validateMongoId } from "../utils/validateMongoId";

export type getReactedCommentByUserIdCommentIdTypes = {
  userId: string;
  commentId: string;
};

export const getReactedCommentByUserIdCommentIdService = async ({
  commentId,
  userId,
}: getReactedCommentByUserIdCommentIdTypes) => {
  validateMongoId({ value: commentId, valueName: "commentId" });
  validateMongoId({ value: userId, valueName: "userId" });

  const existingReactedComments = await ReactedComment.findOne({
    commentId,
    userId,
  }).lean();
  if (!existingReactedComments) {
    return null;
    // throw createHttpError(404, "existingReactedComments Not found");
  }

  return existingReactedComments;
};
