import mongoose, { InferSchemaType, model } from "mongoose";

const defaultRecommendedSellerProductAmountSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
  amountOfProducts: {
    type: Number,
  },
});

type DefaultRecommendedSellerProductAmount = InferSchemaType<
  typeof defaultRecommendedSellerProductAmountSchema
>;

export default model<DefaultRecommendedSellerProductAmount>(
  "defaultRecommendedSellerProductAmount",
  defaultRecommendedSellerProductAmountSchema
);
