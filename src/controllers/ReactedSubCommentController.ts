import { RequestHandler } from "express";
import { getReactedSubCommentByUserIdCommentIdService } from "../services/ReactedSubCommentService";

interface GetReactedSubCommentByUserIdParams {
  userId: string;
  subCommentId: string;
}

// @route GET http://localhost:3500/reactedSubComments/:subCommentId/users/:userId
// @access Private
export const getReactedSubCommentByUserIdCommentId: RequestHandler<
  GetReactedSubCommentByUserIdParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const comment = await getReactedSubCommentByUserIdCommentIdService({
      userId: req.params.userId,
      subCommentId: req.params.subCommentId,
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
