import { Router } from "express";
//import CartManager from "../dao/managers/CartManager.js";
//const cartMan = new CartManager("src/data/cartData.json");
import { cartsModel } from "../dao/models/carts.model.js";
import { commonErrorMessages } from "../utils.js";
const { INTERNAL_ERROR_MESSAGE } = commonErrorMessages;

const cartsRouter = Router();

cartsRouter.get("/:cid", (req, res) => {
  let cartID = req.params.cid;
  cartsModel
    .findById(cartID)
    .then((found) => {
      if (found) {
        res.json(found);
      } else res.status(404).send({ message: "Product not found" });
    })
    .catch((error) => {
      if (error.name === "CastError") {
        res.status(404).send({ message: "Invalid cart ID" });
      } else {
        console.error(error);
        res.status(500).send(error.message);
      }
    });
});

cartsRouter.post("/", (req, res) => {
  const products = req.body.products ?? [];
  if (products.length > 0) {
    cartsModel
      .create({ products })
      .then(() => {
        res.status(201).send({ message: "Cart created successfully" });
      })
      .catch((error) => {
        console.error(error);
        if (error.name == "ValidationError")
          res.status(422).send({ message: "Invalid payload" });
        else res.status(500).send(INTERNAL_ERROR_MESSAGE);
      });
  } else {
    res.status(422).send("Invalid request body");
  }
});

cartsRouter.post("/:cid/product/:pid", (req, res) => {
  const {cid, pid} = req.params
  /*cartMan
    .addProductToCart(req.params.cid, parseInt(req.params.pid))
    .then(() => {
      res.status(201).send("Product added");
    })
    .catch((err) => {
      res.status(422).send(err.message);
    });*/
    cartsModel.findOneAndUpdate(
      {_id: cid, products: { $elemMatch: { id: pid } } },
      { $inc: { "products.$.quantity": 1 } },
      { new: true }
    )
      .then((updatedDoc) => {
        if (updatedDoc) {
          console.log('product found and quantity incremented:', updatedDoc);
          res.status(201).send({message:"Product added successfully"})
        } else {
          cartsModel.findOneAndUpdate(
            {_id: cid, products: {$exists:true}},
            { $addToSet: { products: { id: pid} } },
            { new: true, upsert: true }
          )
            .then((newDoc) => {
              console.log('New product created:', newDoc);
              res.status(201).send({message:"Product added successfully"})
            })
            .catch((error) => {
              console.error('Error creating new document:', error);
              res.status(500).send(INTERNAL_ERROR_MESSAGE);
            });
        }
      })
      .catch((error) => {
        console.error('Error updating document:', error);
        res.status(500).send(INTERNAL_ERROR_MESSAGE);
      });
});

export default cartsRouter;
