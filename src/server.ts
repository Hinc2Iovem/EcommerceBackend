import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import env from "./utils/validateEnv";
import {
  userRouter,
  authRouter,
  productRouter,
  productCharacteristicRouter,
  productSubCharacteristicRouter,
  cartRouter,
  favouriteRouter,
  subCommentRouter,
  commentRouter,
  boughtProductRouter,
  soldProductRouter,
  reactedCommentRouter,
  reactedSubCommentRouter,
  defaultRecommendedProductAmountRouter,
  defaultRecommendedProductRouter,
  recommendedProductAmountRouter,
  recommendedProductRouter,
  becommingSellerRoute,
} from "./routes/index";
import { connectDB } from "./config/dbConn";

dotenv.config();

const app = express();

const port = env.PORT;

connectDB();

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));
// app.use((req: Request, res: Response, next: NextFunction) => {
//   next();
// }, cors({ maxAge: 84600, credentials: true }));

app.use(express.json());
app.use(cookieParser());

app.use("/users", userRouter);
app.use("/requestSellers", becommingSellerRoute);
app.use("/auth", authRouter);
app.use("/products", productRouter);
app.use("/productCharacteristics", productCharacteristicRouter);
app.use("/productSubCharacteristics", productSubCharacteristicRouter);
app.use("/boughtProducts", boughtProductRouter);
app.use("/soldProducts", soldProductRouter);
app.use("/carts", cartRouter);
app.use("/favourite", favouriteRouter);
app.use("/comments", commentRouter);
app.use("/reactedComments", reactedCommentRouter);
app.use("/subComments", subCommentRouter);
app.use("/reactedSubComments", reactedSubCommentRouter);
app.use("/recommendedProductsAmount", recommendedProductAmountRouter);
app.use("/recommendedProducts", recommendedProductRouter);
app.use("/defaultRecommendedProducts", defaultRecommendedProductRouter);
app.use(
  "/defaultRecommendedProductsAmount",
  defaultRecommendedProductAmountRouter
);

mongoose.connection.once("open", () => {
  console.log("Connected");
  app.listen(port, () => console.log(`Working on port ${port}`));
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
