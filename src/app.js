import express from "express";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import { Server } from "socket.io";
import handlebars from "express-handlebars";
import viewsRouter from "./routes/views.router.js";
import mongoose from "mongoose";

const PORT = 4000;
const app = express();
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor iniciado en https://127.0.0.1:${PORT}/ con éxito`);
});

const socketServer = new Server(httpServer);

app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "\\views");
app.set("view engine", "handlebars");

app.use(express.static(__dirname + "/public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose
  .connect(
    "mongodb+srv://coderApp:wE4oumTXU0SDrkIJ@rscoderecommerce.2ldq8rq.mongodb.net/Ecommerce?retryWrites=true&w=majority"
  )
  .then(async ()=> {
    console.log("mongodb conectado");
    app.use("/api/products", productsRouter);
    app.use("/api/carts", cartsRouter);
    app.use("/", viewsRouter(socketServer));
  })
  .catch((e) => {
    console.error("Error al conectar al cluster: " + e.message);
    process.exit();
  });