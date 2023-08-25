import { ProductRepository } from "../models/repository/product.repository.js";

const productRepository = new ProductRepository();

class ProductService {
  findproductById = async (id) => await productRepository.getOne(id);
  findproductByCriteria = async (criteria) =>
    await productRepository.getOneByCriteria(criteria);
  existsByCriteria = async (criteria) =>
    await productRepository.existsByCriteria(criteria);
  createProduct = async (product) => await productRepository.create(product);
  getAllProductsPaginated = async (limit, page, query, sort) =>
    await productRepository.getAllPaginated(limit, page, query, sort);
  updateProduct = async (productID, product) =>
    await productRepository.update(productID, product);
  deleteProduct = async (productID)=>
    await productRepository.delete(productID);
}

export default new ProductService();
