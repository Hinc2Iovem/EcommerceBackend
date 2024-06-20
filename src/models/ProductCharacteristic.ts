import mongoose, { InferSchemaType, model } from "mongoose";

const productCharacteristicSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
});

type ProductCharacteristic = InferSchemaType<
  typeof productCharacteristicSchema
>;

export default model<ProductCharacteristic>(
  "ProductCharacteristic",
  productCharacteristicSchema
);
