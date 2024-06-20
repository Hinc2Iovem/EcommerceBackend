import mongoose, { InferSchemaType, model } from "mongoose";

const subCommentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  amountOfLikes: {
    type: Number,
    default: 0,
  },
  amountOfDisLikes: {
    type: Number,
    default: 0,
  },
  commentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
  },
  subCommentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubComment",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

type SubComment = InferSchemaType<typeof subCommentSchema>;

export default model<SubComment>("subComment", subCommentSchema);
