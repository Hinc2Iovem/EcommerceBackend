import createHttpError from "http-errors";
import mongoose from "mongoose";

interface validateMongoIdTypes {
  value: string | undefined;
  valueName: string;
}

export const validateMongoId = ({ value, valueName }: validateMongoIdTypes) => {
  if (!mongoose.isValidObjectId(value)) {
    throw createHttpError(400, `Invalid ${valueName}`);
  }
};
