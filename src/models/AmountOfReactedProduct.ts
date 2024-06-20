import mongoose, { InferSchemaType, model } from "mongoose";

const amountOfReactedProductSchema = new mongoose.Schema({
  amountOfReactions: {
    type: Number,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  reactedProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ReactedProduct",
  },
});

type AmountOfReactedProduct = InferSchemaType<
  typeof amountOfReactedProductSchema
>;

export default model<AmountOfReactedProduct>(
  "AmountOfReactedProduct",
  amountOfReactedProductSchema
);
