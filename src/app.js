import express from "express"
import productsRouter from "./routes/products.router.js"
import cartsRouter from "./routes/carts.router.js"

const app = express()

const PORT = 4000;

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)

app.listen(PORT,()=>{
    console.log(`Servidor iniciado en https://127.0.0.1:${PORT}/ con éxito`)
})