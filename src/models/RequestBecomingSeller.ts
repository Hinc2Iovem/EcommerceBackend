import mongoose, { InferSchemaType, model } from "mongoose";

// waiting, allowed, denied
const becommingSellerSchema = new mongoose.Schema(
  {
    denyingReason: {
      type: String,
    },
    status: {
      type: String,
      default: "waiting",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

type BecommingSeller = InferSchemaType<typeof becommingSellerSchema>;

export default model<BecommingSeller>("BecommingSeller", becommingSellerSchema);
