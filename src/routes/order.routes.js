import { Router } from "express";
import OrderController from "../controllers/order.controller.js";

class OrderRoutes {
  constructor() {
    this.orderController = new OrderController();
    this.router = Router();
    this.initRoutes();
  }

  initRoutes() {
    this.router.post("/order", this.orderController.create);
  }
}

export default new OrderRoutes().router;
