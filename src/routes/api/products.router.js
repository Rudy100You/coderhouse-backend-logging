import { Router } from "express";
import productController from "../../controllers/product.controller.js";
import { currentUserIsAdmin } from "../../utils/middlewares/session.validations.js";
const productsRouter = Router();

productsRouter.get("/", productController.getAllProducts);
productsRouter.get("/:pid", productController.getProduct);
productsRouter.post("/",currentUserIsAdmin, productController.createProduct);
productsRouter.put("/:pid",currentUserIsAdmin,productController.updateProductData);
productsRouter.delete("/:pid",productController.deleteProduct);

export default productsRouter;
