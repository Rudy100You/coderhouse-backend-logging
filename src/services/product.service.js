export default class ProductService {
  constructor(productRepository){
    this.productRepository = productRepository
  }

  findproductById = async (id) => await this.productRepository.getOne(id);
  findproductByCriteria = async (criteria) =>
    await this.productRepository.getOneByCriteria(criteria);
  existsByCriteria = async (criteria) =>
    await this.productRepository.existsByCriteria(criteria);
  createProduct = async (product) => await this.productRepository.create(product);
  getAllProductsPaginated = async (limit, page, query, sort) =>
    await this.productRepository.getAllPaginated(limit, page, query, sort);
  updateProduct = async (productID, product) =>
    await this.productRepository.update(productID, product);
  deleteProduct = async (productID)=>
    await this.productRepository.delete(productID);
}