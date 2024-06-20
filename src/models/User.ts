import mongoose, { InferSchemaType, model } from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  roles: {
    type: [String],
    default: ["Customer"],
  },
  balance: {
    type: Number,
    default: 0,
  },
  profileImg: {
    type: String,
  },
});

type User = InferSchemaType<typeof userSchema>;

export default model<User>("User", userSchema);
