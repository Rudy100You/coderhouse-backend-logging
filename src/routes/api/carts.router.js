import { Router } from "express";
import { CartRepository } from "../../dao/repository/cart.repository.js";
import { commonErrorOutput } from "../../utils/utils.js";
import { ProductRepository } from "../../dao/repository/product.repository.js";
//import CartManager from "../dao/managers/CartManager.js"
//const cartMan = new CartManager("src/data/cartData.json")
//import { cartRepository } from "../dao/models/carts.repository.js"
//import { commonErrorMessages } from "../utils.js"

const cartsRouter = Router();

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();

const validateProducts = async (products) => {
  if (products.length > 0) {
    for (const product of products) {
      await productRepository
        .existsByCriteria({ _id: product.product })
        .then((exists) => {
          if (!exists) {
            const err = new Error(
              `Product with id [${product.product}] does not exist`
            );
            err.status = 404;
            throw err;
          }
        })
        .catch((e) => {
          //TODO: generalize this error
          if (e.name == "CastError")
            e.message = `field [products.product] must be of type ${e.kind}`;
          throw e;
        });
    }
  }
  return true;
};

cartsRouter.get("/:cid", async (req, res) => {
  let cartID = req.params.cid;
  try {
    const cart = await cartRepository.getOne(cartID);
    res.json({ status: "success", payload: cart });
  } catch (err) {
    commonErrorOutput(res, err, "Cart could not be found");
  }
});

cartsRouter.post("/", async (req, res) => {
  const newCart = req.body ?? { products: [] };
  try {
    await validateProducts(newCart.products);
    await cartRepository.create(newCart);
    res
      .status(201)
      .json({ status: "success", payload: "Cart created successfully" });
  } catch (err) {
    commonErrorOutput(res, err);
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await cartRepository.insertCartProducts(cid, pid);
    res
      .status(201)
      .json({ status: "success", payload: "Product inserted successfully" });
  } catch (err) {
    commonErrorOutput(res, err);
  }
});

cartsRouter.delete("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    await cartRepository.removeFromCart(cid, pid);
    res
      .status(200)
      .json({ status: "success", payload: "Product deleted successfully" });
  } catch (err) {
    commonErrorOutput(res, err);
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = req.body;
  try {
    await validateProducts(cart.products);
    await cartRepository.update(cid, cart);
    res
      .status(200)
      .json({
        status: "success",
        payload: "product list updated successfully",
      });
  } catch (err) {
    commonErrorOutput(res, err);
  }
});

cartsRouter.put("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;
  try {
    if (!isNaN(quantity)) {
      await cartRepository.addQuantityToProduct(cid, pid, quantity);
      res
        .status(200)
        .json({ status: "success", payload: "Product deleted successfully" });
    } else {
      let err = new Error("field [quantity] passed and must be a number");
      err.status = 422;
      throw err;
    }
  } catch (err) {
    commonErrorOutput(res, err);
  }
});

cartsRouter.delete("/:cid/", async (req, res) => {
  const { cid } = req.params;
  try {
    await cartRepository.deleteAllProductsFromCart(cid);
    res
        .status(200)
        .json({ status: "success", payload: "All products removed from cart successfully" });
  } catch (err) {
    commonErrorOutput(res, err);
  }
});

export default cartsRouter;
