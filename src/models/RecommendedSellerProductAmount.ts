import mongoose, { InferSchemaType, model } from "mongoose";

const RecommendedSellerProductAmountSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  amountOfProducts: {
    type: Number,
  },
});

type RecommendedSellerProductAmount = InferSchemaType<
  typeof RecommendedSellerProductAmountSchema
>;

export default model<RecommendedSellerProductAmount>(
  "RecommendedSellerProductAmount",
  RecommendedSellerProductAmountSchema
);
