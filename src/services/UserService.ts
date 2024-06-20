import User from "../models/User";
import { validateMongoId } from "../utils/validateMongoId";
import { valueExists } from "../utils/valueExists";

export const getAllUsersService = async () => {
  return User.find().select("-password").lean();
};

interface GetUserByIdService {
  userId: string | undefined;
}

export const getUserByIdService = async ({ userId }: GetUserByIdService) => {
  validateMongoId({ value: userId, valueName: "userId" });
  const existingUser = await User.findById(userId).select("-password").exec();
  if (!existingUser) {
    return null;
  }
  valueExists({ value: existingUser, valueName: "User" });

  return existingUser;
};

interface AddMoneyTypes {
  userId: string | undefined;
  amountOfMoney: number;
}

export const addMoneyService = async ({
  userId,
  amountOfMoney,
}: AddMoneyTypes) => {
  validateMongoId({ value: userId, valueName: "userId" });
  const existingUser = await User.findById(userId).select("-password").exec();
  valueExists({ value: existingUser, valueName: "User" });
  existingUser!.balance += amountOfMoney;
  return await existingUser!.save();
};
