import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");
  const query = {};
  const name = req.query.keywords;
  const category = req.query.category;
  if (name) {
    query.name = new RegExp(name, "i");
  }
  if (category) {
    query.category = new RegExp(category, "i");
  }
  let products;
  try {
    products = await collection.find(query).toArray();
  } catch {
    return res
      .status(500)
      .json({ message: "Could not read product because database connection." });
  }
  return res.status(200).json({ data: products });
});

productRouter.get("/:id", async (req, res) => {
  const collection = db.collection("products");
  const productId = new ObjectId(req.params.id);
  let productData;
  try {
    productData = await collection.findOne({ _id: productId });
  } catch {
    return res
      .status(500)
      .json({ message: "Could not read product because database connection" });
  }
  return res.status(200).json({ data: productData });
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");
  const newProduct = {
    ...req.body,
    created_at: new Date(),
    updated_at: new Date(),
  };
  let createResult;
  try {
    createResult = await collection.insertOne(newProduct);
  } catch {
    return res.status(500).json({
      message: "Could not create product because database connection.",
    });
  }
  return res
    .status(201)
    .json({ message: "Product has been created successfully." });
});

productRouter.put("/:id", async (req, res) => {
  const productId = new ObjectId(req.params.id);
  const collection = db.collection("products");
  const updateRequestData = { ...req.body, updated_at: new Date() };
  try {
    await collection.updateOne({ _id: productId }, { $set: updateRequestData });
  } catch {
    return res.status(500).json({
      message: "Could not update product because database connection.",
    });
  }
  return res.status(200).json({
    message: `Product id ${productId} has been updated successfully`,
  });
});

productRouter.delete("/:id", async (req, res) => {
  const collection = db.collection("products");
  const productId = new ObjectId(req.params.id);
  try {
    await collection.deleteOne({ _id: productId });
  } catch {
    return res.status(500).json({
      message: "Could not delete product because database connection.",
    });
  }
  return res.status(200).json({
    message: `Product id ${productId} has been deleted successfully`,
  });
});

export default productRouter;
