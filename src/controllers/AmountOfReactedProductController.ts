import { RequestHandler } from "express";
import { getAmountOfReactedProductService } from "../services/AmountOfReactedProductService";

interface GetAmountOfReactedProductParams {
  productId: string;
}

// @route GET http://localhost:3500/amountOfReactedProducts/:productId
// @access Public
export const getAmountOfReactedProductByProductId: RequestHandler<
  GetAmountOfReactedProductParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const amount = await getAmountOfReactedProductService({
      productId: req.params.productId,
    });
    if (amount) {
      return res.status(201).json(amount);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};
