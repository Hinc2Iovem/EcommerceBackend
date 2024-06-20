import mongoose, { InferSchemaType, model } from "mongoose";

const favouriteSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

type Favourite = InferSchemaType<typeof favouriteSchema>;

export default model<Favourite>("favourite", favouriteSchema);
