import mongoose, { InferSchemaType, model } from "mongoose";

const productSubCharacteristicSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  subTitle: {
    type: String,
    required: true,
  },
  productCharacteristicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ProductCharacteristic",
  },
});

type ProductSubCharacteristic = InferSchemaType<
  typeof productSubCharacteristicSchema
>;

export default model<ProductSubCharacteristic>(
  "ProductSubCharacteristic",
  productSubCharacteristicSchema
);
