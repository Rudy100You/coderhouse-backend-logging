import mongoose from "mongoose";
export class CommonMDBRepository {
  constructor(collectionName, docSchema) {
    this.baseModel = mongoose.model(collectionName, docSchema);
  }

  async getAll() {
    const allDocs = await this.baseModel.find({});
    return allDocs;
  }

  async getOne(id) {
    const oneDoc = await this.baseModel.findById(id);
    return oneDoc;
  }

  async existsByCriteria(criteria) {
    const foundProduct = await this.baseModel.exists(criteria);
    return foundProduct;
  }

  async create(doc) {
    const newDoc = await this.baseModel.create(doc);
    return newDoc;
  }

  async update(id, doc) {
    await this.baseModel.findByIdAndUpdate(id, doc);
    const docUpdated = await this.baseModel.findById(id);
    return docUpdated;
  }

  async delete(id) {
    const deletedDoc = await this.baseModel.findByIdAndDelete(id);
    return deletedDoc;
  }
}
