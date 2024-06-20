import createHttpError from "http-errors";
import Comment from "../models/Comment";
import ReactedComment from "../models/ReactedComment";
import SubComment from "../models/SubComment";
import User from "../models/User";
import Product from "../models/Product";
import { validateMongoId } from "../utils/validateMongoId";
import { valueExists } from "../utils/valueExists";

export type getSubCommentsByCommentIdServiceTypes = {
  commentId: string;
};

export const getSubCommentsByCommentIdService = async ({
  commentId,
}: getSubCommentsByCommentIdServiceTypes) => {
  validateMongoId({ value: commentId, valueName: "commentId" });

  const existingComment = await Comment.findById(commentId).exec();
  // If existing comment was removed, commentId will be FK for product
  const existingProduct = await Product.findById(commentId).exec();
  if (existingProduct) {
    const Subcomments = await SubComment.find({ commentId }).lean();
    return Subcomments;
  }

  if (!existingComment) {
    const existingSubComment = await SubComment.findById(commentId).exec();
    if (!existingSubComment) {
      // valueExists({ value: existingComment, valueName: "Comment" });
      return null;
    }
  }

  const Subcomments = await SubComment.find({ commentId }).lean();
  return Subcomments;
};

export type CreateSubCommentTypes = {
  userId: string;
  commentId: string;
  text?: string;
};

export const createSubCommentService = async ({
  commentId,
  userId,
  text,
}: CreateSubCommentTypes) => {
  validateMongoId({ value: commentId, valueName: "commentId" });
  validateMongoId({ value: userId, valueName: "userId" });

  if (!text) {
    throw createHttpError(401, "Text is required");
  }

  const existingUser = await User.findById(userId).select("-password").lean();
  valueExists({ value: existingUser, valueName: "User" });

  const existingComment = await Comment.findById(commentId).exec();
  if (!existingComment) {
    const existingSubComment = await SubComment.findById(commentId).exec();
    if (!existingSubComment) {
      valueExists({ value: existingComment, valueName: "Comment" });
    }
  }

  return await SubComment.create({ commentId, userId, text });
};

export type UpdateSubCommentTypes = {
  subCommentId: string;
  text?: string;
};

export const updateSubCommentService = async ({
  subCommentId,
  text,
}: UpdateSubCommentTypes) => {
  validateMongoId({ value: subCommentId, valueName: "subCommentId" });

  if (!text) {
    throw createHttpError(401, "Text is required");
  }

  const existingSubComment = await SubComment.findById(subCommentId).exec();
  valueExists({ value: existingSubComment, valueName: "SubComment" });

  existingSubComment!.text = text;

  return await existingSubComment!.save();
};

export type UpdateLikesSubCommentTypes = {
  userId: string;
  subCommentId: string;
  isLiked: boolean;
};

export const updateLikesSubCommentService = async ({
  subCommentId,
  userId,
  isLiked,
}: UpdateLikesSubCommentTypes) => {
  validateMongoId({ value: subCommentId, valueName: "subCommentId" });
  validateMongoId({ value: userId, valueName: "userId" });

  const existingUser = await User.findById(userId).select("-password").lean();
  valueExists({ value: existingUser, valueName: "User" });
  const existingSubComment = await SubComment.findById(subCommentId).exec();
  valueExists({ value: existingSubComment, valueName: "SubComment" });

  let existingReactedSubComment = await ReactedComment.findOne({
    userId,
    subCommentId,
  });

  if (existingReactedSubComment) {
    if (
      (existingReactedSubComment.isLiked && isLiked) ||
      (!existingReactedSubComment.isLiked && !isLiked)
    ) {
      return "Comment was already Reacted";
    }
    if (isLiked) {
      existingSubComment!.amountOfLikes += 1;
      existingSubComment!.amountOfDisLikes -= 1;
      existingReactedSubComment.isLiked = isLiked;
    } else if (!isLiked) {
      existingSubComment!.amountOfLikes -= 1;
      existingSubComment!.amountOfDisLikes += 1;
      existingReactedSubComment.isLiked = isLiked;
    }
  } else {
    existingReactedSubComment = new ReactedComment({
      isLiked,
      subCommentId,
      userId,
    });
    if (isLiked) {
      existingSubComment!.amountOfLikes += 1;
    } else if (!isLiked) {
      existingSubComment!.amountOfDisLikes += 1;
    }
  }

  await Promise.all([
    existingSubComment!.save(),
    existingReactedSubComment.save(),
  ]);
  return existingSubComment;
};

export type DeleteSubCommentTypes = {
  subCommentId: string;
};

export const deleteSubCommentService = async ({
  subCommentId,
}: DeleteSubCommentTypes) => {
  validateMongoId({ value: subCommentId, valueName: "subCommentId" });

  const Subcomment = await SubComment.findById(subCommentId).exec();
  valueExists({ value: Subcomment, valueName: "SubComment" });

  await SubComment.findByIdAndDelete(subCommentId);

  return `SubComment with id:${subCommentId} was removed`;
};
