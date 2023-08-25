import { Router } from "express";
import productController from "../../controllers/product.controller.js";
const productsRouter = Router();

productsRouter.get("/", productController.getAllProducts);
productsRouter.get("/:pid", productController.getProduct);
productsRouter.post("/", productController.createProduct);
productsRouter.put("/:pid",productController.updateProductData);
productsRouter.delete("/:pid",productController.deleteProduct);

export default productsRouter;
