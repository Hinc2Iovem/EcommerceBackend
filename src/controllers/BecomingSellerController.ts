import { RequestHandler } from "express";
import {
  allowingSellerService,
  createRequestBecomingSellerService,
  getAllRequestsBecomingSellerService,
  getRequestBecomingSellerByUserIdService,
} from "../services/BecomingSellerService";

type GetRequestBecomingSellerByUserIdParams = {
  userId: string | undefined;
};

// @route GET http://localhost:3500/requestSellers/users/:userId
// Private
export const getRequestBecomingSellerByUserId: RequestHandler<
  GetRequestBecomingSellerByUserIdParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const request = await getRequestBecomingSellerByUserIdService({
      userId: req.params.userId,
    });
    if (request) {
      return res.status(201).json(request);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

// @route GET http://localhost:3500/requestSellers
// Private
export const getAllRequestsBecomingSeller: RequestHandler = async (
  req,
  res,
  next
) => {
  try {
    const request = await getAllRequestsBecomingSellerService();
    if (request) {
      return res.status(201).json(request);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

interface CreateRequestBecomingSellerParams {
  userId: string;
}

// @route POST http://localhost:3500/requestSellers/users/:userId
// Private
export const createRequestBecomingSeller: RequestHandler<
  CreateRequestBecomingSellerParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const request = await createRequestBecomingSellerService({
      userId: req.params.userId,
    });
    if (request) {
      return res.status(201).json(request);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

interface AllowingToBecomeSellerParams {
  userId: string | undefined;
  requestId: string;
}

interface AllowingToBecomeSellerBody {
  denyingReason: string | undefined;
  status: string;
}

// @route PATCH http://localhost:3500/requestSellers/:requestId/users/:userId
// @access Private
export const allowingToBecomeSeller: RequestHandler<
  AllowingToBecomeSellerParams,
  unknown,
  AllowingToBecomeSellerBody,
  unknown
> = async (req, res, next) => {
  try {
    const user = await allowingSellerService({
      userId: req.params.userId,
      requestId: req.params.requestId,
      denyingReason: req.body.denyingReason,
      status: req.body.status,
    });
    if (user) {
      return res.status(201).json(user);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};
