import { RequestHandler } from "express";
import { getReactedCommentByUserIdCommentIdService } from "../services/ReactedCommentService";

interface GetReactedCommentByUserIdParams {
  userId: string;
  commentId: string;
}

// @route GET http://localhost:3500/reactedComments/:commentId/users/:userId
// @access Private
export const getReactedCommentByUserIdCommentId: RequestHandler<
  GetReactedCommentByUserIdParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const comment = await getReactedCommentByUserIdCommentIdService({
      userId: req.params.userId,
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
