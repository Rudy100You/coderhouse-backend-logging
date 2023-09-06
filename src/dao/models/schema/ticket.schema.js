import { Schema } from "mongoose";

const ticketSchema = Schema(
  {
    code: {
      type: String,
      unique: true
    },
    purchase_datetime: {
      type: Schema.Types.Date,
      default: new Date() 
    },
    amount: {
      type: Number,
      required: true,
    },
    purchaser: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
  },
  { versionKey: false }
);

export { ticketSchema };
