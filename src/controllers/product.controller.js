import CustomError from "../utils/errors/CustomError.js";
import ErrorTypes from "../utils/errors/ErrorTypes.js";

export default class ProductController {
  constructor(productService){
    this.productService = productService
  }

  getAllProducts = (req, res) => {
    let responseBodyMapping;
    let { limit, page, query, sort } = req.query;

    if (!limit || parseInt(limit) === 0) limit = 10;
    this.productService.getAllPaginated(limit, page, query, sort).then((pagRes) => {
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
    });
  };
  getProduct = (req, res, next) => {
    let productID = req.params.pid;
    this.productService
      .findproductById(productID)
      .then((product) => {
        res.json(product);
      })
      .catch((err) => {
        err.notFoundEntity = "Product";
        next( err);
      });
  };
  createProduct =async (req, res) => {
    const newProduct = req.body;
    const productFound = await this.productService.existsByCriteria({
      code: newProduct.code,
    });
    if (productFound) {
      CustomError.throwNewError(
        {
          name: ErrorTypes.ENTITY_ALREADY_EXISTS_ERROR,
          cause: "Provided product already exists",
          message: `Product with code ${newProduct.code}  already exists`,
          customParameters: {entity:"Product", entityID: newProduct.code}
        }
      );
    } else {
      await this.productService.createProduct(newProduct);
      res
        .status(201)
        .json({ status: "success", payload: "Product created successfully" });
    }
  };

  updateProductData =async (req, res, next) => {
    const productID = req.params.pid;
    const modProduct = req.body;

    try {
      await this.productService.updateProduct(productID, modProduct);
      res
        .status(200)
        .json({ status: "success", payload: "Product updated successfully" });
    } catch (err) {
      err.notFoundEntity = "Product";
      next(err);
    }
  };

  deleteProduct =async (req, res, next) => {
    const productID = req.params.pid;
    try {
      await this.productService.delete(productID);
      res
        .status(200)
        .json({ status: "success", payload: "Product deleted successfully" });
    } catch (err) {
      err.notFoundEntity = "Product";
      next(err);
    }
  };
}