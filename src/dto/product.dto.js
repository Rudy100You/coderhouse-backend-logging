export default class ProductDTO{
    constructor(product){
        this._id = product._id
        this.title = product.title
        this.description = product.description
        this.description = product.description
        this.price = product.price
        this.status = product.status
        this.stock = product.stock
        this.category = product.category
        this.thumbnails = product.thumbnails
    }
}