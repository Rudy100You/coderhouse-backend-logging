import mongoose, { Schema } from "mongoose";
const cartCollection = "carts";

const cartSchema = mongoose.Schema({
  id: {
    type: Schema.ObjectId,
    required: true
  },
  quantity: {
    type: Number,
    default: 1,
  },
});

const cartsSchema = mongoose.Schema(
  {
    products: {
      type: [cartSchema],
      required: true,
    },
  },
  { versionKey: false }
);

export const cartsModel = mongoose.model(cartCollection, cartsSchema);
