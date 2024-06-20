import createHttpError from "http-errors";

type ValueExistsTypes<T> = {
  value: T;
  valueName: string;
};

export const valueExists = <T>({ value, valueName }: ValueExistsTypes<T>) => {
  if (!value) {
    throw createHttpError(404, `${valueName} with such id doesn't exist`);
  }
};
