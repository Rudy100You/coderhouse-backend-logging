import { Router } from "express";
import ProductService from "../../services/product.service.js";
import ProductRepository  from "../../dao/repository/product.repository.js";
import CartController from "../../controllers/cart.controller.js"
import CartService from "../../services/cart.service.js";
import CartRepository from "../../dao/repository/cart.repository.js";


const cartsRouter = Router();
const productService = new ProductService(new ProductRepository)
const cartController = new CartController(new CartService(productService, new CartRepository()), productService)

cartsRouter.get("/:cid", cartController.getCart);
cartsRouter.post("/", cartController.createCart);
cartsRouter.post("/:cid/product/:pid", cartController.insertCartProduct);
cartsRouter.delete("/:cid/product/:pid", cartController.deleteCartProduct);
cartsRouter.put("/:cid", cartController.updateEntireCart);
cartsRouter.put("/:cid/product/:pid", cartController.updateCartProductQuantity);
cartsRouter.delete("/:cid/", cartController.deleteAllProductsFromCart);
cartsRouter.post("/:cid/purchase", cartController.finalizePurchase)

export default cartsRouter;
