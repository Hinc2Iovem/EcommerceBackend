import mongoose, { InferSchemaType, model } from "mongoose";

const cartSchema = new mongoose.Schema({
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
  totalPrice: {
    type: Number,
  },
});

type Cart = InferSchemaType<typeof cartSchema>;

export default model<Cart>("cart", cartSchema);
