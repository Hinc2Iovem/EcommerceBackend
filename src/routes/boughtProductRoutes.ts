import express from "express";
import { getAllBoughtProductsByUserId } from "../controllers/BoughtProductController";

export const boughtProductRouter = express.Router();

// Default route === /boughtProducts

boughtProductRouter.route("/users/:userId").get(getAllBoughtProductsByUserId);
