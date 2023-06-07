import fs from "fs";

class ProductManager {
  validFields = ["title", "description", "price", "thumbnail", "code", "stock"];

  constructor(path) {
    this.path = path;
    if (!fs.existsSync(path)) throw "Error: File not Found";
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    let data = { products: [] };
    await this.parseDataFromFile()
      .then((fileData) => {
        data = fileData;
      })
      .catch((err) => {
        console.info(
          "data file not found or empty, formatting/creating new file"
        );
      });
    let partialProduct = { title, description, price, thumbnail, code, stock };
    let emptyFields = [];

    Object.values(partialProduct).forEach((field, idx) => {
      if (!field) {
        emptyFields.push(Object.keys(partialProduct)[idx]);
      }
    });

    if (emptyFields.length <= 0) {
      let codeFound;
      if (
        !data.products.some((p) => {
          let { id, ...rest } = p;
          codeFound = rest.code;
          return partialProduct.code === rest.code;
        })
      ) {
        let nextProductId =
          data.products.reduce((max, obj) => {
            return obj.id > max ? obj.id : max;
          }, 0) + 1;

        data.products.push({
          id: nextProductId,
          ...partialProduct,
        });

        fs.writeFileSync(this.path, JSON.stringify(data));
        console.log("Product added successfully");
      } else {
        console.error(
          `Product rejected: Product with code "${codeFound}" already exists`
        );
      }
    } else
      console.error(
        `Product rejected: Mandatory fields "${emptyFields.join(
          ", "
        )}" are REQUIRED`
      );
  }

  async getProducts() {
    return await this.parseDataFromFile();
  }

  async getProductById(id) {
    let data = await this.parseDataFromFile();
    let product = data.products.find((p) => p.id == id);
    if (product == null) console.error("Product not found");
    else return product;
  }

  async updateProduct(id, contentToUpdate) {
    let data = await this.parseDataFromFile();
    let indexToUpdate = data.products.findIndex((product) => product.id === id);
    if (this.validateObjectKeys(contentToUpdate) && indexToUpdate >= 0) {
      data.products.splice(indexToUpdate, 1, {
        id: indexToUpdate + 1,
        ...contentToUpdate,
      });
      fs.writeFileSync(this.path, JSON.stringify(data));
      console.log("Updated Successfully");
    } else {
      console.error("Nothing to update: id not found");
    }
  }

  async deleteProduct(id) {
    let data = await this.parseDataFromFile();
    if (data.products.some((product) => product.id == id)) {
      data.products.splice(
        data.products.findIndex((product) => product.id === id),
        1
      );
      fs.writeFileSync(this.path, JSON.stringify(data));
      console.log(`Product with Id [${id}] has been deleted successfully`);
    } else {
      console.error(`Product with Id [${id}] does not exist`);
    }
  }

  validateObjectKeys(obj) {
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (!this.validFields.includes(keys[i])) {
        return false;
      }
    }
    return true;
  }

  async parseDataFromFile() {
    return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
  }
}

export default ProductManager;
