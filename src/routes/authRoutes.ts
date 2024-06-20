import express from "express";
import { login, logout, refresh, signUp } from "../controllers/AuthController";

export const authRouter = express.Router();

// Default route === /auth

authRouter.route("/").post(login);
authRouter.route("/register").post(signUp);
authRouter.route("/refresh").get(refresh);
authRouter.route("/logout").post(logout);
