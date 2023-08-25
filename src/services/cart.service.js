import { CartRepository} from "../models/repository/cart.repository.js";

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
  insertCartProducts = async (cid,pid)=>
    await cartRepository.insertCartProducts(cid,pid)
  removeFromCart = async (cid,pid)=>
    await cartRepository.removeFromCart(cid, pid)
  updateCart = async (cid,cart)=>
    await cartRepository.update(cid,cart)
  deleteAllProductsFromCart = async(cid)=> 
    await cartRepository.deleteAllProductsFromCart(cid)
}

export default new CartService();
