import { RequestHandler } from "express";
import { getAllBoughtProductsByUserIdService } from "../services/BoughtProductService";

interface GetAllBoughtProductsByUserIdParams {
  userId: string;
}

// @route GET http://localhost:3500/boughtProducts/users/:userId
// @access Private
export const getAllBoughtProductsByUserId: RequestHandler<
  GetAllBoughtProductsByUserIdParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const product = await getAllBoughtProductsByUserIdService({
      userId: req.params.userId,
    });
    if (product) {
      return res.status(201).json(product);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};
