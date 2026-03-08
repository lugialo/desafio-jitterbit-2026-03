import Order from "../models/Order.js";

class OrderService {
  async createOrder(orderData) {
    const order = await Order.create(orderData);
    return order;
  }
}

export default OrderService;
