import { Router } from "express";
import { ObjectId } from "mongodb";
import { db } from "../utils/db.js";

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  const collection = db.collection("products");
  try {
    const products = await collection.find({}).toArray();

    return res.json({ data: products });
  } catch (error) {
    return res.status(500).json({ message: "server failed to get products" });
  }
});

productRouter.get("/:id", async (req, res) => {
  const collection = db.collection("products");
  const productId = new ObjectId(req.params.id);
  try {
    const products = await collection.findOne({ _id: productId });

    return res.json({ data: products });
  } catch (error) {
    return res.status(500).json({ message: "server failed to get products" });
  }
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");
  const productData = { ...req.body };
  try {
    const newProduct = await collection.insertOne(productData);

    return res.json({
      message: `Product (${newProduct.insertedId}) has been created successfully`,
    });
  } catch (error) {
    return res.status(500).json({ message: "server failed to create product" });
  }
});

productRouter.put("/:id", async (req, res) => {
  const collection = db.collection("products");
  const id = new ObjectId(req.params.id);
  const newProductData = { ...req.body };

  try {
    await collection.updateOne({ _id: id }, { $set: newProductData });

    return res.json({ message: `Product has been updated successfully` });
  } catch (error) {
    return res.status(500).json({ message: "server failed to update product" });
  }
});

productRouter.delete("/:id", async (req, res) => {
  const collection = db.collection("products");
  const id = new ObjectId(req.params.id);

  try {
    await collection.deleteOne({ _id: id });
    return res.json({
      message: `Product has been deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({ message: "server failed to delete product" });
  }
});

export default productRouter;
