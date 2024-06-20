import { RequestHandler } from "express";
import { getAllSoldProductsByUserIdService } from "../services/SoldProductService";

interface GetAllSoldProductsByUserIdParams {
  userId: string;
}

// @route GET http://localhost:3500/soldProducts/users/:userId
// @access Private
export const getAllSoldProductsByUserId: RequestHandler<
  GetAllSoldProductsByUserIdParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const product = await getAllSoldProductsByUserIdService({
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
