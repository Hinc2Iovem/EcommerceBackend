import express from "express";
import { getAllSoldProductsByUserId } from "../controllers/SoldProductController";

// Default route === /soldProducts

export const soldProductRouter = express.Router();

soldProductRouter.route("/users/:userId").get(getAllSoldProductsByUserId);
