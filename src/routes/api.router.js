import { Router } from "express";
import cartsRouter from "./api/carts.router.js";
import sessionsRouter from "./api/sessions.router.js";
import productsRouter from "./api/products.router.js";
import { currentUserIsUser, validateSession } from "../utils/middlewares/session.validations.js";
import { generateProducts } from "../utils/mock.generators.js";
import { logger } from "../utils/middlewares/logger.handler.js";

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

apiRouter.get("/loggerTest",(req,res)=>{
    logger.debug("This is a DEBUG message")
    logger.info("This is an INFO message")
    logger.warning("This is a WARN message")
    logger.error("This is an ERROR message")
    logger.fatal("This is a FATAL message")
    res.status(200).send({status: "success", message: "Log successful. Please check console and/or file logs"})
})

export default apiRouter