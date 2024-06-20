import mongoose, { InferSchemaType, model } from "mongoose";

const reactedProductSchema = new mongoose.Schema({
  rating: {
    type: Number,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

type ReactedProduct = InferSchemaType<typeof reactedProductSchema>;

export default model<ReactedProduct>("ReactedProduct", reactedProductSchema);
