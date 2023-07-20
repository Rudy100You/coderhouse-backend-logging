import { Router } from "express";
const viewsRouter = Router();

viewsRouter.get("/products", (req, res)=>{
    res.render("products",{})
})
export default viewsRouter;
