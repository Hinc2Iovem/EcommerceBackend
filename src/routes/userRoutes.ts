import express from "express";
import {
  addMoney,
  getAllUsers,
  getUserById,
} from "../controllers/UserController";
import { verifyJWT } from "../middleware/verifyJWT";

// Default route === /users

export const userRouter = express.Router();

userRouter.route("/").get(getAllUsers);
userRouter.route("/:userId").get(getUserById);
userRouter.route("/:userId/money").patch(verifyJWT, addMoney);
