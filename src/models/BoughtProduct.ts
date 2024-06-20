import mongoose, { InferSchemaType, model } from "mongoose";

const boughtProductSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quantity: {
    type: Number,
  },
});

type BoughtProduct = InferSchemaType<typeof boughtProductSchema>;

export default model<BoughtProduct>("boughtProduct", boughtProductSchema);
