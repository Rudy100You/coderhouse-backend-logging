import ProductManager from "./js/classes/ProductManager.js";
import express from "express"


const app = express()

const PORT = 4000;
const productData = new ProductManager("./src/data/productData.json")

app.use(express.urlencoded({extended:true}))

app.get("/products", async (req,res)=>{
    let responseData = {products:[]}
    let {limit} = req.query
    responseData = await productData.getProducts()
    if( Number.parseInt(limit) >= 0)
    {
        res.json({products: responseData.products.slice(0, limit)})
    }
    else{
    res.json(responseData)}
})

app.get("/products/:pid",  (req,res)=>{
    let productID = req.params.pid
    productData.getProductById(productID).then((product)=>{
        if(product){
            res.json({product})
        }
        else{
            res.status(404).send(`Product with id [${productID}] not found`)
        }
    })
})

app.listen(PORT,()=>{
    console.log(`Servidor iniciado en https://localhost:${PORT}/ con éxito`)
})