import productService from "../services/product.service.js";
import CustomError from "../utils/errors/CustomError.js";
import ErrorTypes from "../utils/errors/ErrorTypes.js";

class ProductController {
  getAllProducts = (req, res) => {
    let responseBodyMapping;
    let { limit, page, query, sort } = req.query;

    if (!limit || parseInt(limit) === 0) limit = 10;
    productService.getAllPaginated(limit, page, query, sort).then((pagRes) => {
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
  getProduct = (req, res) => {
    let productID = req.params.pid;
    productService
      .findproductById(productID)
      .then((product) => {
        res.json(product);
      })
      .catch((err) => {
        err.notFoundEntity = "Product";
        throw err;
      });
  };
  createProduct = async (req, res) => {
    const newProduct = req.body;
    const productFound = await productService.existsByCriteria({
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
      await productService.createProduct(newProduct);
      res
        .status(201)
        .json({ status: "success", payload: "Product created successfully" });
    }
  };

  updateProductData = async (req, res) => {
    const productID = req.params.pid;
    const modProduct = req.body;

    try {
      await productService.updateProduct(productID, modProduct);
      res
        .status(200)
        .json({ status: "success", payload: "Product updated successfully" });
    } catch (err) {
      err.notFoundEntity = "Product";
      throw err;
    }
  };

  deleteProduct = async (req, res) => {
    const productID = req.params.pid;
    try {
      await productService.delete(productID);
      res
        .status(200)
        .json({ status: "success", payload: "Product deleted successfully" });
    } catch (err) {
      err.notFoundEntity = "Product";
      throw err;
    }
  };
}

export default new ProductController();
