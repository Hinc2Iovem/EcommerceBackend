import createHttpError from "http-errors";
import Comment from "../models/Comment";
import Product from "../models/Product";
import ReactedComment from "../models/ReactedComment";
import SubComment from "../models/SubComment";
import User from "../models/User";
import { validateMongoId } from "../utils/validateMongoId";
import { valueExists } from "../utils/valueExists";

export type getCommentsByProductIdServiceTypes = {
  productId: string;
};

export const getCommentsByProductIdService = async ({
  productId,
}: getCommentsByProductIdServiceTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });

  const existingComments = await Comment.find({ productId }).lean();
  if (!existingComments || !existingComments.length) {
    return [];
    // return "There are no comment for this product";
  }

  return existingComments;
};

export type CreateCommentTypes = {
  userId: string;
  productId: string;
  text?: string;
};

export const createCommentService = async ({
  productId,
  userId,
  text,
}: CreateCommentTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });
  validateMongoId({ value: userId, valueName: "userId" });

  const existingUser = await User.findById(userId).select("-password").lean();
  valueExists({ value: existingUser, valueName: "User" });

  const existingProduct = await Product.findById(productId).exec();
  valueExists({ value: existingProduct, valueName: "Product" });

  if (!text) {
    throw createHttpError(401, "Text is required");
  }

  const comment = await Comment.create({ productId, userId, text });

  return comment;
};

export type UpdateCommentTypes = {
  commentId: string;
  text?: string;
};

export const updateCommentService = async ({
  commentId,
  text,
}: UpdateCommentTypes) => {
  validateMongoId({ value: commentId, valueName: "commentId" });

  if (!text) {
    throw createHttpError(401, "Text is required");
  }

  const existingComment = await Comment.findById(commentId).exec();
  valueExists({ value: existingComment, valueName: "Comment" });

  existingComment!.text = text;

  return await existingComment!.save();
};

export type UpdateLikesCommentTypes = {
  userId: string;
  commentId: string;
  isLiked: boolean;
};

export const updateLikesCommentService = async ({
  commentId,
  userId,
  isLiked,
}: UpdateLikesCommentTypes) => {
  validateMongoId({ value: userId, valueName: "userId" });
  validateMongoId({ value: commentId, valueName: "commentId" });

  const existingUser = await User.findById(userId).select("-password");
  valueExists({ value: existingUser, valueName: "User" });

  const existingComment = await Comment.findById(commentId);
  valueExists({ value: existingComment, valueName: "Comment" });

  let existingReactedComment = await ReactedComment.findOne({
    userId,
    commentId,
  }).exec();

  if (existingReactedComment) {
    if (
      (existingReactedComment.isLiked && isLiked) ||
      (!existingReactedComment.isLiked && !isLiked)
    ) {
      return null;
    }
    if (isLiked && !existingReactedComment.isLiked) {
      existingComment!.amountOfLikes += 1;
      existingComment!.amountOfDisLikes -= 1;
      existingReactedComment.isLiked = isLiked;
    } else if (!isLiked && existingReactedComment.isLiked) {
      existingComment!.amountOfLikes -= 1;
      existingComment!.amountOfDisLikes += 1;
      existingReactedComment.isLiked = isLiked;
    }
  } else {
    existingReactedComment = new ReactedComment({
      isLiked,
      commentId,
      userId,
    });
    if (isLiked) {
      existingComment!.amountOfLikes += 1;
    } else if (!isLiked) {
      existingComment!.amountOfDisLikes += 1;
    }
  }

  await Promise.all([existingComment!.save(), existingReactedComment.save()]);
  return existingComment;
};

export type DeleteCommentTypes = {
  commentId: string;
};

export const deleteCommentService = async ({
  commentId,
}: DeleteCommentTypes) => {
  validateMongoId({ value: commentId, valueName: "commentId" });

  const comment = await Comment.findById(commentId).exec();
  valueExists({ value: comment, valueName: "Comment" });

  const subComments = await SubComment.find({ commentId }).exec();
  if (subComments) {
    for (const subComment of subComments) {
      subComment.commentId = comment!.productId;
      await subComment.save();
    }
  }

  await Comment.findByIdAndDelete(commentId);

  return `Comment with id:${commentId} was removed`;
};
