import mongoose from "mongoose";
const productCollection = 'products';

const productSchema = mongoose.Schema({
    id: {
      type: Number,
      unique:true
    },
    title: {
      type: String
    },
    description: {
      type: String
    },
    code: {
      type: String,
      required:true,
      unique:true
    },
    price: {
      type: Number
    },
    status: {
      type: Boolean
    },
    stock: {
      type: Number
    },
    category: {
      type: String
    },
    thumbnails: {
      type: [
        String
      ]
    }
  },{versionKey:false})

  export const productsModel = mongoose.model(productCollection,productSchema)