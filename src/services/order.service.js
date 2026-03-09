import Order from "../models/Order.js";

class OrderService {
  // Calcula o valor total do pedido com base nos itens (preço * quantidade)
  calculateTotal(items) {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  }

  async createOrder(orderData) {
    // recalcula o valor total com base nos itens fornecidos
    if (orderData.items) {
      orderData.value = this.calculateTotal(orderData.items);
    }

    // verificar se já existe um pedido com o mesmo orderId
    const existing = await Order.findOne({ orderId: orderData.orderId });
    if (existing) {
      throw new Error("Pedido já existe.");
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

  async deleteOrder(orderId) {
    const result = await Order.deleteOne({ orderId });
    if (result.deletedCount === 0) {
      throw new Error("Pedido não encontrado.");
    }
    return true;
  }
}

export default OrderService;
