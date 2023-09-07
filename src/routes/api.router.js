import { Router } from "express";
import cartsRouter from "./api/carts.router.js";
import sessionsRouter from "./api/sessions.router.js";
import productsRouter from "./api/products.router.js";
import { currentUserIsUser, validateSession } from "../utils/middlewares/session.validations.js";

const apiRouter = Router()

apiRouter.use("/sessions",sessionsRouter)

apiRouter.use("/carts",currentUserIsUser,cartsRouter)

apiRouter.use("/products",validateSession, productsRouter)

export default apiRouter