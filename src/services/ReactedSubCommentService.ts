import ReactedComment from "../models/ReactedComment";
import { validateMongoId } from "../utils/validateMongoId";

export type getReactedSubCommentByUserIdCommentIdTypes = {
  userId: string;
  subCommentId: string;
};

export const getReactedSubCommentByUserIdCommentIdService = async ({
  subCommentId,
  userId,
}: getReactedSubCommentByUserIdCommentIdTypes) => {
  validateMongoId({ value: subCommentId, valueName: "subCommentId" });
  validateMongoId({ value: userId, valueName: "userId" });

  const existingReactedSubComments = await ReactedComment.findOne({
    subCommentId,
    userId,
  }).lean();
  if (!existingReactedSubComments) {
    return null;
    // throw createHttpError(404, "existingReactedSubComments Not found");
  }

  return existingReactedSubComments;
};
