import { Router } from "express";
//import ProductManager from "../dao/managers/ProductManager.js";
import { productsModel } from "../dao/models/products.model.js";
//const productMan = new ProductManager("src/data/productData.json");
import { commonErrorMessages } from "../utils.js";
const {INTERNAL_ERROR_MESSAGE }= commonErrorMessages;

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  productsModel
    .find()
    .then((products) => {
      let { limit } = req.query;
      if (Number.parseInt(limit) >= 0) {
        res.json(products.splice(0, limit));
      } else {
        res.json(products);
      }
    })
    .catch(() => {
      res.status(500).send(INTERNAL_ERROR_MESSAGE);
    });
});

productsRouter.get("/:pid", (req, res) => {
  let productID = req.params.pid;
  productsModel
    .findOne({ id: productID })
    .then((product) => {
      if (product) {
        res.json(product);
      } else {
        res.status(404).send(`Product with id [${productID}] not found`);
      }
    })
    .catch(() => {
      res.status(500).send(INTERNAL_ERROR_MESSAGE);
    });
});

productsRouter.post("/", (req, res) => {
  const newProduct = req.body;

  productsModel.countDocuments().then((pCount) => {
    let productID = pCount + 1;
    productsModel
      .aggregate([{ $group: { _id: null, maxField: { $max: "$id" } } }])
      .exec()
      .then((result) => {
        if (result.length > 0) {
          productID = result[0].maxField + 1;
          const newProductModel = new productsModel({
            id: productID,
            ...newProduct,
          });

          productsModel
            .exists({ code: newProduct.code })
            .then((codeFound) => {
              if (!codeFound) {
                newProductModel
                  .save()
                  .then(() => {
                    res
                      .status(201)
                      .send({ message: "Product created successfully" });
                  })
                  .catch((err) => {
                    res.status(422).send({ message: err.message });
                  });
              } else {
                res.status(422).send({
                  message: `code with value ${newProduct.code} already exists`,
                });
              }
            })
            .catch(() => {
              res.status(500).send(INTERNAL_ERROR_MESSAGE);
            });
        } else {
          console.log("No documents found");
        }
      })
      .catch(() => {
        res.status(500).send(INTERNAL_ERROR_MESSAGE);
      });
  });
});

productsRouter.put("/:pid", (req, res) => {
  const productID = req.params.pid;
  const modProduct = req.body;

  productsModel
    .findOneAndUpdate({ id: parseInt(productID) }, modProduct, { new: false })
    .then(() => {
      res.status(200).send({ message: "Product updated successfully" });
    })
    .catch((error) => {
      console.error("Error updating product:", error);
      res.status(500).send(INTERNAL_ERROR_MESSAGE);
    });
});

productsRouter.delete("/:pid", (req, res) => {
  const productID = req.params.pid;

  productsModel
    .findOneAndDelete({ id: productID })
    .then((found) => {
      if (found)
        res.status(200).send({ message: "Product deleted successfully" });
      else 
        res.status(200).send({ message: "Nothing to delete" });
    })
    .catch((error) => {
      console.error("Error updating product:", error);
      res.status(500).send(INTERNAL_ERROR_MESSAGE);
    });
  /*productMan
    .deleteProduct(parseInt(productID))
    .then(() => {
      res.status(200).send({ message: "Product deleted successfully" });
    })
    .catch((err) => {
      res.status(422).send({ message: err.message });
    });*/
});

export default productsRouter;
