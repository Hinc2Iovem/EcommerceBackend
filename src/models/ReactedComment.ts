import mongoose, { InferSchemaType, model } from "mongoose";

const reactedCommentSchema = new mongoose.Schema({
  isLiked: {
    type: Boolean,
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

type ReactedComment = InferSchemaType<typeof reactedCommentSchema>;

export default model<ReactedComment>("ReactedComment", reactedCommentSchema);
