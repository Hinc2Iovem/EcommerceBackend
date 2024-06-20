import createHttpError from "http-errors";
import ProductCharacteristic from "../models/ProductCharacteristic";
import ProductSubCharacteristic from "../models/ProductSubCharacteristic";
import { validateMongoId } from "../utils/validateMongoId";
import { valueExists } from "../utils/valueExists";

export const getAllProductSubCharacteristicsService = async ({
  productCharacteristicId,
}: {
  productCharacteristicId: string;
}) => {
  validateMongoId({
    value: productCharacteristicId,
    valueName: "productCharacteristicId",
  });
  const productSubCharacteristics = await ProductSubCharacteristic.find({
    productCharacteristicId,
  }).lean();

  if (!productSubCharacteristics || !productSubCharacteristics.length) {
    return [];
    // throw createHttpError(404, "existingReactedSubComments Not found");
  }
  return productSubCharacteristics;
};

type CreateProductSubCharacteristicsServiceTypes = {
  productCharacteristicId: string;
  text: string;
  subTitle: string;
};

export const createProductSubCharacteristicsService = async ({
  productCharacteristicId,
  subTitle,
  text,
}: CreateProductSubCharacteristicsServiceTypes) => {
  validateMongoId({
    value: productCharacteristicId,
    valueName: "productCharacteristicId",
  });

  const existingProductCharacteristic = await ProductCharacteristic.findById(
    productCharacteristicId
  );
  valueExists({
    value: existingProductCharacteristic,
    valueName: "ProductCharacteristic",
  });

  return await ProductSubCharacteristic.create({
    productCharacteristicId,
    text,
    subTitle,
  });
};

type UpdateProductSubCharacteristicsServiceTypes = {
  productSubCharacteristicId: string;
  subTitle: string;
  text: string;
};

export const updateProductSubCharacteristicsService = async ({
  productSubCharacteristicId,
  subTitle,
  text,
}: UpdateProductSubCharacteristicsServiceTypes) => {
  validateMongoId({
    value: productSubCharacteristicId,
    valueName: "productSubCharacteristicId",
  });

  const existingProductSubCharacteristic =
    await ProductSubCharacteristic.findById(productSubCharacteristicId);
  valueExists({
    value: existingProductSubCharacteristic,
    valueName: "ProductSubCharacteristic",
  });

  if (subTitle) {
    existingProductSubCharacteristic!.subTitle = subTitle;
  }
  if (text) {
    existingProductSubCharacteristic!.text = text;
  }
  return await existingProductSubCharacteristic?.save();
};

type DeleteProductSubCharacteristicsServiceTypes = {
  productSubCharacteristicId: string;
};

export const deleteProductSubCharacteristicsService = async ({
  productSubCharacteristicId,
}: DeleteProductSubCharacteristicsServiceTypes) => {
  validateMongoId({
    value: productSubCharacteristicId,
    valueName: "productSubCharacteristicId",
  });

  await ProductSubCharacteristic.findOneAndDelete({
    _id: productSubCharacteristicId,
  });
  return `SubCharacteristic with id ${productSubCharacteristicId} was removed.`;
};
