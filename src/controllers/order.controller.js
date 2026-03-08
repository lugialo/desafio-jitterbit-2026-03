import * as z from "zod";
import OrderService from "../services/order.service.js";
import { orderPayloadSchema } from "../middlewares/validation/orderPayloadSchema.js";

class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  create = async (req, res) => {
    try {
      const parsedData = orderPayloadSchema.parse(req.body);
      const createdOrder = await this.orderService.createOrder(parsedData);
      res.status(201).json(createdOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.issues });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };

  get = async (req, res) => {
    try {
      const orderId = req.params.id;
      const order = await this.orderService.getOrderById(orderId);
      res.status(200).json(order);
    } catch (error) {
      res.status(404).json({ error: "Pedido não encontrado." });
    }
  };

  list = async (req, res) => {
    try {
      const orders = await this.orderService.listOrders();
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar pedidos." });
    }
  };
}

export default OrderController;
