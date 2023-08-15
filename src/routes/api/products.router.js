import { Router } from "express";
//import ProductManager from "../dao/managers/ProductManager.js";
import { ProductRepository } from "../../dao/repository/product.repository.js";
import { commonErrorOutput } from "../../utils/utils.js";
//const productMan = new ProductManager("src/data/productData.json");
const productsRouter = Router();
const productRepository = new ProductRepository();

productsRouter.get("/", (req, res) => {
  let responseBodyMapping;
  let { limit, page, query, sort } = req.query;

  if (!limit || parseInt(limit) === 0) limit = 10;
  productRepository
    .getAllPaginated(limit, page, query, sort)
    .then((pagRes) => {
      responseBodyMapping = pagRes;
      if (
        page &&
        (responseBodyMapping.totalPages < parseInt(page) ||
          parseInt(page) < 1 ||
          isNaN(page))
      ) {
        let err = new Error("Requested page doesn't exist");
        err.status = 404;
        throw err;
      }

      const linkURL =
        req.protocol + "://" + req.get("host") + req.baseUrl + "?page=";
      responseBodyMapping.prevLink = null;
      responseBodyMapping.nextLink = null;

      if (responseBodyMapping.prevPage)
        responseBodyMapping.prevLink = linkURL + responseBodyMapping.prevPage;
      if (responseBodyMapping.nextPage)
        responseBodyMapping.nextLink = linkURL + responseBodyMapping.nextPage;

      res.json({ status: "success", ...responseBodyMapping });
    })
    .catch((err) => {
      commonErrorOutput(res, err);
    });
});

productsRouter.get("/:pid", (req, res) => {
  let productID = req.params.pid;
  productRepository
    .getOne(productID)
    .then((product) => {
      res.json(product);
    })
    .catch((err) => {
      commonErrorOutput(res, err, "Product could not be found");
    });
});

productsRouter.post("/", async (req, res) => { 
  const newProduct = req.body;
  try {
    const productFound = await productRepository.existsByCriteria({
      code: newProduct.code,
    });
    if (productFound) {
      let err = new Error(`Product with code ${newProduct.code} already exists`);
      err.status = 400;
      throw err;
    } else {
      await productRepository.create(newProduct);
      res
        .status(201)
        .json({ status: "success", payload: "Product created successfully" });
    }
  } catch (err) {
    commonErrorOutput(res, err);
  }
});

productsRouter.put("/:pid", async (req, res) => {

  const productID = req.params.pid;
  const modProduct = req.body;

  try {
    await productRepository.update(productID, modProduct)
    res
        .status(200)
        .json({ status: "success", payload: "Product updated successfully" });

  }catch(err){
    commonErrorOutput(res,err, `Product with id [${productID}] does not exist for update`)
  }

});

productsRouter.delete("/:pid", async (req, res) => {
  const productID = req.params.pid;
  try {
    await productRepository.delete(productID)
    res
        .status(200)
        .json({ status: "success", payload: "Product deleted successfully" });

  }catch(err){
    commonErrorOutput(res,err, `Product with id [${productID}] does not exist for deletion`)
  }
});

export default productsRouter;
