import mongoose from "mongoose";
import env from "../utils/validateEnv";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.DATABASE_URI);
  } catch (err) {
    console.log(err);
  }
};
