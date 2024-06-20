import { RequestHandler } from "express";
import {
  addMoneyService,
  getAllUsersService,
  getUserByIdService,
} from "../services/UserService";

export interface UserParams {
  userId: string;
}

// @route GET http://localhost:3500/users
// @access Private
export const getAllUsers: RequestHandler = async (req, res, next) => {
  try {
    const user = await getAllUsersService();
    if (user) {
      return res.status(201).json(user);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

// @route GET http://localhost:3500/users/:userId
// @access Private
export const getUserById: RequestHandler<
  UserParams,
  unknown,
  unknown,
  unknown
> = async (req, res, next) => {
  try {
    const user = await getUserByIdService({ userId: req.params.userId });
    if (user) {
      return res.status(201).json(user);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};

type AddMoneyBodyTypes = {
  amountOfMoney: number;
};

// @route PATCH http://localhost:3500/users/:userId/money
// @access Private
export const addMoney: RequestHandler<
  UserParams,
  unknown,
  AddMoneyBodyTypes,
  unknown
> = async (req, res, next) => {
  try {
    const user = await addMoneyService({
      userId: req.params.userId,
      amountOfMoney: req.body.amountOfMoney,
    });
    if (user) {
      return res.status(201).json(user);
    } else {
      return res.status(400).json({ message: "Something went wrong" });
    }
  } catch (error) {
    next(error);
  }
};
