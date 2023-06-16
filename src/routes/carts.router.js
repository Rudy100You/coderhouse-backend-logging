import { Router } from "express";
//import CartManager from "../js/classes/CartManager.js";
//const cartMan =  new CartManager("src/data/cartsData.json");

const cartsRouter = Router();

cartsRouter.post("/",async(req,res)=>{
    const products = req.body.products??[]
    if(products.length > 0){
        await cartMan.createNewCart()
        res.status(201).send("cart created")
    }
    else{
        res.status(422).send("Empty body")
    }

})

export default cartsRouter