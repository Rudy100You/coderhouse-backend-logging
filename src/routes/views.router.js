import { Router } from "express";
import { ProductRepository } from "../dao/repositories/product.repository.js";
import { CartRepository } from "../dao/repositories/cart.repository.js";
const viewsRouter = Router();
const productRepository = new ProductRepository()
const cartRepository = new CartRepository()

viewsRouter.get("/products/:pgid?",async (req, res)=>{
    const {pgid} = req.params
    let {category, sort} = req.query
    let data
    try{
        data = await productRepository.getAllPaginated(10,pgid, {category: category}, sort)
        if(isNaN(pgid) || pgid > data.totalPages)
            data = { invalidPageError : true}
    }
    catch(err){
        console.error(err)
    }
    res.render("products",data)
})

viewsRouter.get("/product/:pid",async (req, res)=>{
    const {pid} = req.params
    let products
    try{
        products = await productRepository.getOne(pid)
    }
    catch(err){
        console.error(err)
    }
    res.render("product",products)
})

viewsRouter.get("/carts/:cid",async (req, res)=>{
    const {cid} = req.params
    let cart
    try{
        cart = await cartRepository.getOne(cid)
    }
    catch(err){
        console.error(err)
    }
    res.render("cart",cart)
})
export default viewsRouter;
