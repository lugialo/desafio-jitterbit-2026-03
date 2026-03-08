import Order from "../models/Order.js";

class OrderService {

  async createOrder(orderData) {
    const order = await Order.create(orderData);
    return order;
  }

  async getOrderById(orderId) {
    const order = await Order.findOne({ orderId });
    if (!order) {
      throw new Error("Pedido não encontrado.");
    }
    return order;
  }
}

export default OrderService;
