import createHttpError from "http-errors";
import RequestBecomingSeller from "../models/RequestBecomingSeller";
import User from "../models/User";
import { validateMongoId } from "../utils/validateMongoId";
import { valueExists } from "../utils/valueExists";

export const getRequestBecomingSellerByUserIdService = async ({
  userId,
}: {
  userId: string | undefined;
}) => {
  validateMongoId({ value: userId, valueName: "User" });
  const requestByUserId = await RequestBecomingSeller.findOne({
    userId,
  }).lean();
  if (!requestByUserId) {
    return null;
  }
  return requestByUserId;
};

export const getAllRequestsBecomingSellerService = async () => {
  const allRequests = await RequestBecomingSeller.find().lean();
  if (!allRequests.length) {
    return [];
  }
  return allRequests;
};

type CreateRequestBecomingSellerTypes = {
  userId: string;
};

export const createRequestBecomingSellerService = async ({
  userId,
}: CreateRequestBecomingSellerTypes) => {
  validateMongoId({ value: userId, valueName: "userId" });

  const existingRequest = await RequestBecomingSeller.findOne({
    userId,
  }).exec();

  if (existingRequest && existingRequest.status !== "denied") {
    throw createHttpError(409, "Request was already sent");
  }

  if (existingRequest && existingRequest.status === "denied") {
    existingRequest.status = "waiting";
    existingRequest.denyingReason = "";
    return await existingRequest.save();
  }

  const userAlreadySeller = await User.findById(userId).lean();
  if (
    userAlreadySeller?.roles.includes("Seller") ||
    userAlreadySeller?.roles.includes("seller")
  ) {
    throw createHttpError(400, "You are already a seller");
  }

  return await RequestBecomingSeller.create({ userId });
};

interface AllowingSellerService {
  userId: string | undefined;
  requestId: string;
  denyingReason: string | undefined;
  status: string;
}

export const allowingSellerService = async ({
  userId,
  requestId,
  status,
  denyingReason,
}: AllowingSellerService) => {
  validateMongoId({ value: userId, valueName: "userId" });
  const existingUser = await User.findById(userId).select("-password").exec();
  valueExists({ value: existingUser, valueName: "User" });
  const existingRequest = await RequestBecomingSeller.findById(requestId)
    .select("-password")
    .exec();
  valueExists({ value: existingRequest, valueName: "Request" });

  if (status === "denied") {
    if (!denyingReason) {
      throw createHttpError(400, "Denying reason is required");
    }
    existingRequest!.status = status;
    existingRequest!.denyingReason = denyingReason;
    return await existingRequest?.save();
  }

  if (status === "allowed") {
    if (existingUser?.roles) {
      if (!existingUser.roles.includes("Seller")) {
        existingUser!.roles.push("Seller");
      }
      existingRequest!.status = status;
    }
    await existingUser!.save();
  }

  return await existingRequest!.save();
};
