import productService from "../services/product.service.js";
import cartService from "../services/cart.service.js";
import { commonErrorOutput } from "../utils/utils.js";

class CartController {
  validateProducts = async (products) => {
    if (products.length > 0) {
      for (const product of products) {
        await productService
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

  getCart = async (req, res) => {
    let cartID = req.params.cid;
    try {
      const cart = await cartService.getOne(cartID);
      res.json({ status: "success", payload: cart });
    } catch (err) {
      commonErrorOutput(res, err, "Cart could not be found");
    }
  };

  createCart = async (req, res) => {
    const newCart = req.body ?? { products: [] };
    try {
      await this.validateProducts(newCart.products);
      await cartService.createCart(newCart);
      res
        .status(201)
        .json({ status: "success", payload: "Cart created successfully" });
    } catch (err) {
      commonErrorOutput(res, err);
    }
  };

  insertCartProduct = async (req, res) => {
    const { cid, pid } = req.params;
    try {
      await cartService.insertCartProducts(cid, pid);
      res
        .status(201)
        .json({ status: "success", payload: "Product inserted successfully" });
    } catch (err) {
      commonErrorOutput(res, err);
    }
  };

  deleteCartProduct = async (req, res) => {
    const { cid, pid } = req.params;
    try {
      await cartService.removeFromCart(cid, pid);
      res
        .status(200)
        .json({ status: "success", payload: "Product deleted successfully" });
    } catch (err) {
      commonErrorOutput(res, err);
    }
  };

  updateEntireCart = async (req, res) => {
    const { cid } = req.params;
    const cart = req.body;
    try {
      await this.validateProducts(cart.products);
      await cartService.updateCart(cid, cart);
      res.status(200).json({
        status: "success",
        payload: "product list updated successfully",
      });
    } catch (err) {
      commonErrorOutput(res, err);
    }
  };

  updateCartProductQuantity = async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
      if (!isNaN(quantity)) {
        await cartService.addQuantityToProduct(cid, pid, quantity);
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
  };

  deleteAllProductsFromCart = async (req, res) => {
    const { cid } = req.params;
    try {
      await cartService.deleteAllProductsFromCart(cid);
      res.status(200).json({
        status: "success",
        payload: "All products removed from cart successfully",
      });
    } catch (err) {
      commonErrorOutput(res, err);
    }
  };

  finalizePurchase = async(req, res)=>{
    const { cid } = req.params;
    try {
      const productsWithoutStock = await cartService.finalizePurchase(cid, req.user.email)

      if (productsWithoutStock.length > 0)
      {
        res.status(409).json({
          status: "failure",
          message: "Purchse has products with no stock",
          payload: {products: productsWithoutStock}
        })
      }
      else{
        res.status(200).json({
        status: "success",
        payload: "Purchse finished sucessfully",
      });
      }
      
    } catch (err) {
      commonErrorOutput(res, err);
    }
  }
}

export default new CartController();
