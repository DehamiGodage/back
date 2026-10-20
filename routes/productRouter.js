import express from 'express';
import { getProducts, saveProduct,deleteProduct,updateProduct ,getProductById } from "../controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/", getProducts);

productRouter.post("/", saveProduct);

productRouter.delete("/:productId", deleteProduct);

productRouter.put("/:productId", updateProduct);

productRouter.get("/:productId", getProductById);

//also can include login and create user routes here if needed

export default productRouter;