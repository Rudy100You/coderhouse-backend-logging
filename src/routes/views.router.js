import { Router } from "express";
import ProductManager from "../dao/managers/ProductManager.js";
import { messagesModel } from "../dao/models/messages.model.js";
//import { commonErrorMessages } from "../utils.js";

//const {INTERNAL_ERROR_MESSAGE}= commonErrorMessages
const socketViewsRouter = Router();
const productMan = new ProductManager("src/data/productData.json");

const retrieveMessagesfromDB = async()=>
  messagesModel.find().then(coll=>{
    const docs = coll.map(doc=> doc.toObject());
    console.log(docs)
    return [...docs]
   }).catch(error=>{
    console.error(error)
   })


const viewsRouter = (io) => {
  socketViewsRouter.get("/", async (req, res) => {
    res.render("home", await productMan.getProducts());
  });

  socketViewsRouter.get("/realtimeproducts", async (req, res) => {
    res.render("realTimeProducts", {});
    let products = await productMan.getProducts();

    io.on("connection", (socket) => {
      io.emit("dataUpdated", products);
      console.log("Cliente conectado");
      socket.on("updateProductList", async () => {
        products = await productMan.getProducts();
        io.emit("dataUpdated", products);
      });
    });
  });

  socketViewsRouter.get("/chat",async (req,res)=>{
    

    io.on("connection", (socket) => {
      retrieveMessagesfromDB().then(data=>{
        io.emit("messageLogs",data)
      })
      
      console.log("Cliente conectado");
      socket.on("message",async data=>{
        await messagesModel.create(data).then(()=>{
          retrieveMessagesfromDB().then(data=>{
          io.emit("messageLogs",data)
        })
        }).catch(error=>{
          console.error(error)
        })
        
      });
    });

    retrieveMessagesfromDB().then(data=>{
      res.render("chat",{messages:data})
    })
  })

  return socketViewsRouter;
};

export default viewsRouter;
