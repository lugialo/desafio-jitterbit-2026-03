import Order from "../models/Order.js";

class OrderService {
  // Calcula o valor total do pedido coms
  calculateTotal(items) {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  async createOrder(orderData) {
    // recalcula o valor total com base nos itens fornecidos
    if (orderData.items) {
      orderData.value = this.calculateTotal(orderData.items);
    }
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

  async listOrders() {
    const orders = await Order.find();
    return orders;
  }

  async updateOrder(orderId, orderData) {
    // recalcula o valor total com base nos itens fornecidos
    if (orderData.items) {
      orderData.value = this.calculateTotal(orderData.items);
    }

    const order = await Order.findOneAndUpdate({ orderId }, orderData, {
      new: true,
    });
    if (!order) {
      throw new Error("Pedido não encontrado.");
    }
    return order;
  }
}

export default OrderService;
