import * as z from "zod";
import OrderService from "../services/order.service.js";
import {
  orderPayloadSchema,
  orderUpdatePayloadSchema,
} from "../middlewares/validation/orderPayloadSchema.js";

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

  update = async (req, res) => {
    try {
      const parsedData = orderUpdatePayloadSchema.parse(req.body);
      const orderId = req.params.id;

      // garantir que o orderId passado via parâmetro seja usado para a edição
      parsedData.orderId = orderId;
      const updatedOrder = await this.orderService.updateOrder(
        orderId,
        parsedData,
      );
      res.status(200).json(updatedOrder);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ errors: error.issues });
      } else if (error.message === "Pedido não encontrado.") {
        res.status(404).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Internal Server Error" });
      }
    }
  };

  delete = async (req, res) => {
    try {
      const orderId = req.params.id;
      await this.orderService.deleteOrder(orderId);
      res.status(204).send();
      return "Pedido deletado com sucesso.";
    } catch (error) {
      res.status(404).json({ error: "Pedido não encontrado." });
    }
  };
}

export default OrderController;
