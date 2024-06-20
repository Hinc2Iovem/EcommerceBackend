import mongoose, { InferSchemaType, model } from "mongoose";

const recommendedSellerProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  recommendedProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

type RecommendedSellerProduct = InferSchemaType<
  typeof recommendedSellerProductSchema
>;

export default model<RecommendedSellerProduct>(
  "recommendedSellerProduct",
  recommendedSellerProductSchema
);
