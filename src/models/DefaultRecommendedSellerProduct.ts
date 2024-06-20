import mongoose, { InferSchemaType, model } from "mongoose";

const defaultRecommendedSellerProductSchema = new mongoose.Schema({
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  category: {
    type: String,
    required: true,
  },
  subCategory: {
    type: String,
    required: true,
  },
});

type DefaultRecommendedSellerProduct = InferSchemaType<
  typeof defaultRecommendedSellerProductSchema
>;

export default model<DefaultRecommendedSellerProduct>(
  "defaultRecommendedSellerProduct",
  defaultRecommendedSellerProductSchema
);
