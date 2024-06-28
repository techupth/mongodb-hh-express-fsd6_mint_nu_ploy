import { Router } from "express";
import express from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";

const productRouter = Router();
const collection = db.collection("products");
productRouter.use(express.json());

productRouter.get("/", async (req, res) => {
  try {
    const result = await collection.find({}).toArray();
    return res.status(200).json({ data: result });
  } catch (error) {
    return res.status(400).json({ message: "Request Error" });
  }
});

productRouter.get("/:id", async (req, res) => {});

productRouter.post("/", async (req, res) => {
  const bodyFromClient = { ...req.body };
  try {
    const result = await collection.insertOne(bodyFromClient);
    console.log(result);
    return res.status(200).json({
      message: `Product has been created successfully in ID:${result.insertedId}`,
    });
  } catch (error) {
    return res.status(400).json({ message: "Request Error" });
  }
});

productRouter.put("/:productId", async (req, res) => {
  const productId = new ObjectId(req.params.id);
  const bodyFromClient = { ...req.body };
  try {
    const result = await collection.updateOne(
      { _id: productId },
      { $set: bodyFromClient }
    );
    return res
      .status(200)
      .json({ message: "Product has been updated successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Request Error" });
  }
});

productRouter.delete("/:id", async (req, res) => {
  const productId = new ObjectId(req.params.id);
  try {
    const result = await collection.deleteOne({ _id: productId });
    return res
      .status(200)
      .json({ message: "Product has been deleted successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Request Error" });
  }
});

export default productRouter;
