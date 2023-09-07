import { CartRepository} from "../dao/repository/cart.repository.js";
import CartDTO from "../dto/cart.dto.js";
import ProductDTO from "../dto/product.dto.js";
import productService from "./product.service.js";
import ticketService from "./ticket.service.js";

const cartRepository = new CartRepository();

class CartService {
  findcartById = async (id) => 
    await cartRepository.getOne(id);
  findcartByCriteria = async (criteria) =>
    await cartRepository.getOneByCriteria(criteria);
  createCart = async (cart) => 
    await cartRepository.create(cart);
  addQuantityToProduct = async (cid, pid, quantity) =>
    await cartRepository.addQuantityToProduct(cid, pid, quantity)
  insertCartProducts = async (cid,pid)=>{
    if(productService.findproductById(pid))
      return await cartRepository.insertCartProducts(cid,pid)
    throw new Error("Product does not exist")
  }
  removeFromCart = async (cid,pid)=>
    await cartRepository.removeFromCart(cid, pid)
  updateCart = async (cid,cart)=>
    await cartRepository.update(cid,cart)
  deleteAllProductsFromCart = async(cid)=> 
    await cartRepository.deleteAllProductsFromCart(cid)

  finalizePurchase = async(cid, purchaser)=>{
    let cart = new CartDTO(this.findcartById(cid))
    let totalAmount = 0;
    let productsWithoutStock = [];

    cart.products.forEach(async (item, idx, pArray) =>{ 
      const product = new ProductDTO(await productService.findproductById(item.product))
      if(item.quantity > product.stock)
        productsWithoutStock = [...productsWithoutStock, pArray.splice(idx,1)[0].product]
      else{
        product.stock =- item.quantity
        await productService.updateProduct(product._id, product)
        totalAmount += (product.price * item.quantity)
      }
    })
    if(productsWithoutStock.length > 0)
      return productsWithoutStock
    else{
      await ticketService.createTicket(totalAmount, purchaser)
      await cartRepository.delete(cid)
    }
  }
}

export default new CartService();
