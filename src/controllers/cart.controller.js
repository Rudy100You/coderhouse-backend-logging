import { commonErrorOutput } from "../utils/utils.js";
import CustomError from "../utils/errors/CustomError.js";
import ErrorTypes from "../utils/errors/ErrorTypes.js";
import { generateNotFoundEntityDescription } from "../utils/errors/errorDescriptions.js";

export default class CartController {
  constructor(cartService, productService){
    this.cartService = cartService
    this.productService = productService
  }
  validateProducts = async (products) => {
    if (products.length > 0) {
      for (const product of products) {
        await this.productService
          .existsByCriteria({ _id: product.product })
          .then((exists) => {
            if (!exists) {
              CustomError.throwNewError({
                error:ErrorTypes.ENTITY_DOES_NOT_EXIST_ERROR,
                cause: generateNotFoundEntityDescription("Product"),
                message: "Error when retrieving product",
                customParameters: {entity:"Product", entityID: product}
              })
            }
          })
      }
    }
    return true;
  };

  getCart = async (req, res) => {
    let cartID = req.params.cid;
    try {
      const cart = await this.cartService.getOne(cartID);
      res.json({ status: "success", payload: cart });
    } catch (err) {
      err.notFoundEntity = "Cart";
      throw err
    }
  };

  createCart = async (req, res) => {
    const newCart = req.body ?? { products: [] };
    try {
      await this.validateProducts(newCart.products);
      await this.cartService.createCart(newCart);
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
      await this.cartService.insertCartProducts(cid, pid);
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
      await this.cartService.removeFromCart(cid, pid);
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
      await this.cartService.updateCart(cid, cart);
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
        await this.cartService.addQuantityToProduct(cid, pid, quantity);
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
      await this.cartService.deleteAllProductsFromCart(cid);
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
      const productsWithoutStock = await this.cartService.finalizePurchase(cid, req.user.email)

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