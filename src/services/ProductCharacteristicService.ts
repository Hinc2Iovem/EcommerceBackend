import Product from "../models/Product";
import ProductCharacteristic from "../models/ProductCharacteristic";
import ProductSubCharacteristic from "../models/ProductSubCharacteristic";
import { validateMongoId } from "../utils/validateMongoId";
import { valueExists } from "../utils/valueExists";

export const getAllProductCharacteristicsService = async ({
  productId,
}: {
  productId: string;
}) => {
  const productCharacteristics = await ProductCharacteristic.find({
    productId,
  }).lean();
  if (!productCharacteristics || !productCharacteristics.length) {
    return [];
  }
  return productCharacteristics;
};

type CreateProductCharacteristicsServiceTypes = {
  productId: string;
  title: string;
};

export const createProductCharacteristicsService = async ({
  productId,
  title,
}: CreateProductCharacteristicsServiceTypes) => {
  validateMongoId({ value: productId, valueName: "productId" });

  const existingProduct = await Product.findById(productId);
  valueExists({ value: existingProduct, valueName: "Product" });

  return await ProductCharacteristic.create({ productId, title });
};

type UpdateProductCharacteristicsServiceTypes = {
  productCharacteristicId: string;
  title: string;
};

export const updateProductCharacteristicsService = async ({
  productCharacteristicId,
  title,
}: UpdateProductCharacteristicsServiceTypes) => {
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

  return await existingProductCharacteristic?.updateOne({ title });
};

type DeleteProductCharacteristicsServiceTypes = {
  productCharacteristicId: string;
};

export const deleteProductCharacteristicsService = async ({
  productCharacteristicId,
}: DeleteProductCharacteristicsServiceTypes) => {
  validateMongoId({
    value: productCharacteristicId,
    valueName: "productCharacteristicId",
  });

  await ProductSubCharacteristic.deleteMany({ productCharacteristicId });
  await ProductCharacteristic.findOneAndDelete({
    _id: productCharacteristicId,
  });
  return `Characteristic with id ${productCharacteristicId} was removed.`;
};
