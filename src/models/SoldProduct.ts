import mongoose, { InferSchemaType, model } from "mongoose";

const soldProductSchema = new mongoose.Schema({
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

type SoldProduct = InferSchemaType<typeof soldProductSchema>;

export default model<SoldProduct>("soldProduct", soldProductSchema);
