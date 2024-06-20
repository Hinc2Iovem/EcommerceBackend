import { RequestHandler } from "express";
import {
  createSubCommentService,
  deleteSubCommentService,
  getSubCommentsByCommentIdService,
  updateSubCommentService,
  updateLikesSubCommentService,
} from "../services/SubCommentService";

export interface GetSubCommentsByCommentIdParamTypes {
  commentId: string;
}

// @route GET http://localhost:3500/subComments/comments/:commentId
// @access PUBLIC
export const getSubCommentsByCommentId: RequestHandler<
  GetSubCommentsByCommentIdParamTypes,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const subComment = await getSubCommentsByCommentIdService({
      commentId: req.params.commentId,
    });
    if (subComment) {
      return res.status(201).json(subComment);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

export interface CreateSubCommentBodyTypes {
  text?: string;
}

export interface CreateSubCommentParamTypes {
  userId: string;
  commentId: string;
}

// @route POST http://localhost:3500/subComments/comments/:commentId/users/:userId
// @access PRIVATE
export const createSubComment: RequestHandler<
  CreateSubCommentParamTypes,
  unknown,
  CreateSubCommentBodyTypes,
  unknown
> = async (req, res, next) => {
  try {
    const subComment = await createSubCommentService({
      commentId: req.params.commentId,
      userId: req.params.userId,
      text: req.body.text,
    });
    if (subComment) {
      return res.status(201).json(subComment);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

export interface UpdateSubCommentBodyTypes {
  text?: string;
}

export interface UpdateSubCommentParamTypes {
  subCommentId: string;
}

// @route PATCH http://localhost:3500/subComments/:subcommentId
// @access PRIVATE
export const updateSubComment: RequestHandler<
  UpdateSubCommentParamTypes,
  unknown,
  UpdateSubCommentBodyTypes,
  unknown
> = async (req, res, next) => {
  try {
    const subComment = await updateSubCommentService({
      text: req.body.text,
      subCommentId: req.params.subCommentId,
    });
    if (subComment) {
      return res.status(201).json(subComment);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

export interface UpdateLikesSubCommentParamTypes {
  userId: string;
  subCommentId: string;
}

export interface UpdateLikesSubCommentBodyTypes {
  isLiked: boolean;
}

// @route PATCH http://localhost:3500/subComments/:subcommentId/users/:userId
// @access PRIVATE
export const updateLikesSubComment: RequestHandler<
  UpdateLikesSubCommentParamTypes,
  unknown,
  UpdateLikesSubCommentBodyTypes,
  unknown
> = async (req, res, next) => {
  try {
    const subComment = await updateLikesSubCommentService({
      userId: req.params.userId,
      subCommentId: req.params.subCommentId,
      isLiked: req.body.isLiked,
    });
    if (subComment) {
      return res.status(201).json(subComment);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

export interface DeleteSubCommentParamTypes {
  subCommentId: string;
}

// @route DELETE httpocalhost:3500/subComments/:subcommentId
// @access PRIVATE
export const deleteSubComment: RequestHandler<
  DeleteSubCommentParamTypes,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const subComment = await deleteSubCommentService({
      subCommentId: req.params.subCommentId,
    });
    if (subComment) {
      return res.status(201).json(subComment);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};
