import { productSchema } from "../models/schema/products.schema.js";
import { CommonMDBRepository } from "./commonMDB.repository.js";

export default class ProductRepository extends CommonMDBRepository {
  constructor() {
    super("products", productSchema);
  }

  async getAllPaginated(limit = 10, page = 1, query, sort) {
    const result = await this.baseModel.paginate(query, {
      limit: parseInt(limit) === 0 ? 10 : limit,
      page,
      sort: ['asc','desc'].includes(sort)? {price: sort} :null,
      customLabels: { docs: "payload" },
      lean:true
    });

    delete result.totalDocs;
    delete result.pagingCounter;

    return result;
  }
}
