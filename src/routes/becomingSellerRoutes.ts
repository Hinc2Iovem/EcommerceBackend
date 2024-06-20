import express from "express";
import { verifyJWT } from "../middleware/verifyJWT";
import { verifyAdmin } from "../middleware/verifyAdmin";
import {
  allowingToBecomeSeller,
  createRequestBecomingSeller,
  getAllRequestsBecomingSeller,
  getRequestBecomingSellerByUserId,
} from "../controllers/BecomingSellerController";

// Default route === /requestSellers
export const becommingSellerRoute = express.Router();

becommingSellerRoute.route("/").get(getAllRequestsBecomingSeller);

becommingSellerRoute
  .route("/users/:userId")
  .get(getRequestBecomingSellerByUserId)
  .post(verifyJWT, createRequestBecomingSeller);

becommingSellerRoute
  .route("/:requestId/users/:userId")
  .patch(verifyAdmin, allowingToBecomeSeller);
