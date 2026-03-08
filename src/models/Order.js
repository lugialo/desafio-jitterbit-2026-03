import { Schema, model } from "mongoose";

// Schema para os itens do pedido
const itemSchema = new Schema(
  {
    productId: { type: Number, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  },
  { _id: false },
);

// Schema para o pedido. items é um array de itemSchema
const orderSchema = new Schema({
  orderId: { type: String, required: true, unique: true },
  value: { type: Number, required: true },
  creationDate: { type: Date, required: true },
  items: [itemSchema],
});

const Order = model("Order", orderSchema);

export default Order;
