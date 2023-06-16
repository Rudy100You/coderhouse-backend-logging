import fs from "fs";
import { writeFile } from "fs/promises";
import { v4 } from "uuid";

class CartManager {
  validFields = ["products"];
  mandatoryFields = ["products"];

  constructor(path) {
    this.path = path;
    if (!fs.existsSync(path)) {
      throw new Error("File not found");
    }
  }
  
  async createNewCart(products) {
    
    let data = await this.parseDataFromFile();
    this.parseDataFromFile()
    .then((fileData) => {
      data = fileData;
    })
    .catch((err) => {
      console.info(
        "data file not found or empty, formatting/creating new file"
      );
      data = { carts: [] };
    });
    let uuid = v4()
    while(data.carts.some(id => id === uuid))
        uuid = v4()
    let newCart = {
      id,
      products,
    };
    data.carts.push(newCart)
    await writeFile(this.path, JSON.stringify(data));
  }

  async parseDataFromFile() {
    return JSON.parse(await fs.promises.readFile(this.path, "utf-8"));
  }
}
export default CartManager;
