import { Router } from "express";
import cartsRouter from "./api/carts.router.js";
import sessionsRouter from "./api/sessions.router.js";
import productsRouter from "./api/products.router.js";
import { currentUserIsUser, validateSession } from "../utils/middlewares/session.validations.js";
import { generateProducts } from "../utils/mock.generators.js";

const apiRouter = Router()

apiRouter.use("/sessions",sessionsRouter)

apiRouter.use("/carts",currentUserIsUser,cartsRouter)

apiRouter.use("/products",validateSession, productsRouter)

apiRouter.get("/mockingproducts", (req,res)=>{
    const products =  (arr = [])=>{
        for(let i =0; i<100; i++)
            arr.push(generateProducts())
        return arr
    }

    res.status('200').send({products: products()})

})

export default apiRouter