import express from "express";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import mongoose from "mongoose";
import { config } from "dotenv";
config({path:__dirname+"\\.env"})

const {MDB_USER,MDB_PASS,MDB_HOST,DATABASE_NAME,PORT} = process.env

const app = express();
app.listen(PORT, () => {
  console.log(`Servidor iniciado en https://127.0.0.1:${PORT}/ con éxito`);
})

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "\\views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose
  .connect(
    `mongodb+srv://${MDB_USER}:${MDB_PASS}@${MDB_HOST}/${DATABASE_NAME}?retryWrites=true&w=majority`
  )
  .then(async ()=> {
    console.log("mongodb conectado");
    app.use("/", viewsRouter);
    app.use("/api/products", productsRouter);
    app.use("/api/carts", cartsRouter);
    
  })
  .catch((e) => {
    console.error("Error al conectar al cluster: " + e.message);
    process.exit();
  });