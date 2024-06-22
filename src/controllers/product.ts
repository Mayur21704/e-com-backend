import { NextFunction, Request, Response } from "express";
import { TryCatch } from "../middlewares/error.js";
import {
  BaseQuery,
  NewProductReqBody,
  SeachRequestQuery,
} from "../types/types.js";
import { Product } from "../models/product.js";
import Errorhandler from "../utils/utility-class.js";
import { rm } from "fs";
import { nodeCache } from "../app.js";
import { invalidatesCache } from "../utils/features.js";
// import { faker } from "@faker-js/faker";

export const getLatestProduct = TryCatch(async (req, res, next) => {
  let products;

  if (nodeCache.has("latest-product")) {
    products = JSON.parse(nodeCache.get("latest-product") as string);
  } else {
    products = await Product.find({}).sort({ createdAt: -1 }).limit(5);
    nodeCache.set("latest-product", JSON.stringify(products));
  }

  return res.status(200).json({
    success: true,
    products,
  });
});

export const getAllCategory = TryCatch(async (req, res, next) => {
  let categories;
  if (nodeCache.has("categories"))
    categories = JSON.parse(nodeCache.get("categories") as string);
  else {
    categories = await Product.distinct("category");
    nodeCache.set("categories", JSON.stringify(categories));
  }

  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getAdminProducts = TryCatch(async (req, res, next) => {
  let product;

  if (nodeCache.has("all-product"))
    product = JSON.parse(nodeCache.get("all-product") as string);
  else {
    product = await Product.find({});
    nodeCache.set("all-product", JSON.stringify(product));
  }

  return res.status(200).json({
    success: true,
    message: product,
  });
});

export const getSingleProducts = TryCatch(async (req, res, next) => {
  const { id } = req.params;
  let product;
  if (nodeCache.has(`product-${id}`)) {
    product = JSON.parse(nodeCache.get(`product-${id}`) as string);
  } else {
    product = await Product.findById(id);
    if (!product) return next(new Errorhandler("Product Not Found", 404));
    nodeCache.set(`product-${id}`, JSON.stringify(product));
  }
  return res.status(200).json({
    success: true,
    product,
  });
});

export const NewProduct = TryCatch(
  async (
    req: Request<{}, {}, NewProductReqBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, category, price, stock } = req.body;

    const photo = req.file;

    if (!photo) return next(new Errorhandler("Please Add Photo", 400));

    if (!name || !category || !price || !stock) {
      rm(photo.path, () => {
        console.log("Deleted Photo");
      });

      return next(new Errorhandler("Please Add All Field", 400));
    }

    const product = await Product.create({
      name,
      category: category.toLowerCase(),
      price,
      stock,
      photo: photo?.path,
    });

    invalidatesCache({ product: true, admin: true });

    return res.status(201).json({
      success: true,
      message: `Product Created ${product.name}`,
    });
  }
);

export const UpdateProduct = TryCatch(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, category, price, stock } = req.body;
    const photo = req.file;
    const product = await Product.findById(req.params.id);

    if (!product) return next(new Errorhandler("Product Not Found", 404));

    if (photo) {
      rm(product.photo!, () => {
        console.log("Old Deleted Photo");
      });
      product.photo = photo.path;
    }

    if (name) product.name = name;
    if (price) product.price = price;
    if (stock) product.stock = stock;
    if (category) product.category = category;

    await product.save();
    invalidatesCache({
      product: true,
      productId: String(product._id),
      admin: true,
    });

    return res.status(201).json({
      success: true,
      message: ` Updated Successfully`,
    });
  }
);

export const DeleteProduct = TryCatch(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) return next(new Errorhandler("Product Not Found", 404));

  rm(product.photo!, () => {
    console.log("Product Photo Deleted");
  });

  await product.deleteOne();

  invalidatesCache({
    product: true,
    productId: String(product._id),
    admin: true,
  });

  return res.status(200).json({
    success: true,
    message: `Product Deleted Successfully`,
  });
});

export const getAllProducts = TryCatch(
  async (req: Request<{}, {}, {}, SeachRequestQuery>, res: Response, next) => {
    const { search, sort, price, category } = req.query;

    const page = Number(req.query.page) || 1;

    const limit = Number(process.env.PRODUCT_PER_PAGE) || 8;
    const skip = (page - 1) * limit;

    const baseQuery: BaseQuery = {};

    if (search)
      baseQuery.name = {
        $regex: search,
        $options: "i",
      };

    if (price)
      baseQuery.price = {
        $lte: Number(price),
      };

    if (category) baseQuery.category = category;

    const productPromise = Product.find(baseQuery)
      .sort(sort && { price: sort === "asc" ? 1 : -1 })
      .limit(limit)
      .skip(skip);

    const [products, filterOnlyProduts] = await Promise.all([
      productPromise,
      Product.find(baseQuery),
    ]);

    const totalPage = Math.ceil(filterOnlyProduts.length / limit);

    return res.status(200).json({
      success: true,
      products,
      totalPage,
    });
  }
);

// const generateRandomProducts = async (count: number = 10) => {
//   const products = [];

//   for (let i = 0; i < count; i++) {
//     const product = {
//       name: faker.commerce.productName(),
//       photo: "uploadsd7691ee3-7174-4689-8b63-0bae77181870.webp",
//       price: faker.commerce.price({ min: 1500, max: 90000, des: 0 }),
//       stock: faker.commerce.price({ min: 0, max: 100, des: 0 }),
//       category: faker.commerce.department(),
//       createdAt: new Date(faker.date.past()),
//       updatedAt: new Date(faker.date.recent()),
//       __v: 0,
//     };
//     products.push(product);
//   }

//   await Product.create(products);

//   console.log({ success: true });
// };

// const deletePRnf = async (count: number = 10) => {
//   const products = await Product.find({}).skip(2);

//   for (let i = 0; i < count; i++) {
//     const product = products[i];
//     await product.deleteOne();
//   }
//   console.log("sucess");
// };

// deletePRnf(38);
