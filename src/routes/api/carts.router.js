import { Router } from "express";
import cartController from "../../controllers/cart.controller.js";

const cartsRouter = Router();

cartsRouter.get("/:cid", cartController.getCart);
cartsRouter.post("/", cartController.createCart);
cartsRouter.post("/:cid/product/:pid", cartController.insertCartProduct);
cartsRouter.delete("/:cid/product/:pid", cartController.deleteCartProduct);
cartsRouter.put("/:cid", cartController.updateEntireCart);
cartsRouter.put("/:cid/product/:pid", cartController.updateCartProductQuantity);
cartsRouter.delete("/:cid/", cartController.deleteAllProductsFromCart);

export default cartsRouter;
