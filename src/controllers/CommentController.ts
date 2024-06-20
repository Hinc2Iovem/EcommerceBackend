import { RequestHandler } from "express";
import {
  createCommentService,
  deleteCommentService,
  getCommentsByProductIdService,
  updateCommentService,
  updateLikesCommentService,
} from "../services/CommentService";

export interface GetCommentsByProductIdParamTypes {
  productId: string;
}

// @route GET http://localhost:3500/comments/products/:productId
// @access PUBLIC
export const getCommentsByProductId: RequestHandler<
  GetCommentsByProductIdParamTypes,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const comment = await getCommentsByProductIdService({
      productId: req.params.productId,
    });
    if (comment) {
      return res.status(201).json(comment);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

export interface CreateCommentBodyTypes {
  text?: string;
}

export interface CreateCommentParamTypes {
  userId: string;
  productId: string;
}

// @route POST http://localhost:3500/comments/products/:productId/users/:userId
// @access PRIVATE
export const createComment: RequestHandler<
  CreateCommentParamTypes,
  unknown,
  CreateCommentBodyTypes,
  unknown
> = async (req, res, next) => {
  try {
    const comment = await createCommentService({
      productId: req.params.productId,
      userId: req.params.userId,
      text: req.body.text,
    });
    if (comment) {
      return res.status(201).json(comment);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

export interface UpdateCommentBodyTypes {
  text?: string;
}

export interface UpdateCommentParamTypes {
  commentId: string;
}

// @route PATCH http://localhost:3500/comments/:commentId
// @access PRIVATE
export const updateComment: RequestHandler<
  UpdateCommentParamTypes,
  unknown,
  UpdateCommentBodyTypes,
  unknown
> = async (req, res, next) => {
  try {
    const comment = await updateCommentService({
      text: req.body.text,
      commentId: req.params.commentId,
    });
    if (comment) {
      return res.status(201).json(comment);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

export interface UpdateLikesCommentParamTypes {
  userId: string;
  commentId: string;
}

export interface UpdateLikesCommentBodyTypes {
  isLiked: boolean;
}

// @route PATCH http://localhost:3500/comments/:commentId/users/:userId/isLiked/:isLiked
// @access PRIVATE
export const updateLikesComment: RequestHandler<
  UpdateLikesCommentParamTypes,
  unknown,
  UpdateLikesCommentBodyTypes,
  unknown
> = async (req, res, next) => {
  try {
    const comment = await updateLikesCommentService({
      userId: req.params.userId,
      commentId: req.params.commentId,
      isLiked: req.body.isLiked,
    });
    if (comment) {
      return res.status(201).json(comment);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

export interface DeleteCommentParamTypes {
  commentId: string;
}

// @route DELETE httpocalhost:3500/comments/:commentId
// @access PRIVATE
export const deleteComment: RequestHandler<
  DeleteCommentParamTypes,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const comment = await deleteCommentService({
      commentId: req.params.commentId,
    });
    if (comment) {
      return res.status(201).json(comment);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};
